import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

// 1. Mock do Repositório
// Criamos um objeto com funções jest.fn() para simular os métodos do repositório
const mockUserRepository = {
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOneBy: jest.fn(),
  preload: jest.fn(),
  remove: jest.fn(),
};

describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<User>;

  beforeEach(async () => {
    // Dizemos para injetar nosso mockUserRepository sempre que alguém (neste caso, o UsersService) pedir pelo Repository<User>
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          // 2. Prover o Mock
          // Usamos o getRepositoryToken para garantir que estamos substituindo
          // o repositório da entidade User pelo nosso mock.
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  // Limpa os mocks depois de cada teste para não interferirem um no outro
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // Testes para o método findAll()
  describe('findAll', () => {
    it('Deve retornar uma lista de usuários', async () => {
      const usersArray = [{ id: 1, name: 'Test User', email: 'test@test.com' }];
      // O que  repositório mockado deve retornar quando for chamado
      mockUserRepository.find.mockResolvedValue(usersArray);

      const result = await service.findAll();

      expect(result).toEqual(usersArray);
      expect(repository.find).toHaveBeenCalledTimes(1);
    });
  });

  // Testes para o método findOne()
  describe('findOne', () => {
    it('Deve retornar um único usuário satisfazendo a sua ID válida', async () => {
      const user = { id: 1, name: 'Test User', email: 'test@test.com' };
      mockUserRepository.findOneBy.mockResolvedValue(user);

      const result = await service.findOne(1);

      expect(result).toEqual(user);
      expect(repository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });

    it('Deve lançar NotFoundException se usuário não encontrado', async () => {
      mockUserRepository.findOneBy.mockResolvedValue(null);

      // Espera que a chamada do método rejeite a promise com uma NotFoundException
      await expect(service.findOne(99)).rejects.toThrow(NotFoundException);
    });
  });

  // Testes para o método create()
  describe('create', () => {
    it('Deve criar e retornar um novo usuáruo', async () => {
      const createUserDto: CreateUserDto = {
        name: 'New User',
        email: 'new@test.com',
        password: 'password123',
      };
      const newUser = { id: 2, ...createUserDto };

      mockUserRepository.create.mockReturnValue(newUser);
      mockUserRepository.save.mockResolvedValue(newUser);

      const result = await service.create(createUserDto);

      expect(result).toEqual(newUser);
      // Verifica se o método create do repositório foi chamado exatamente com os dados do createUserDto garantindo que o serviço está passando os dados corretos para o repositório.
      expect(repository.create).toHaveBeenCalledWith(createUserDto);
      expect(repository.save).toHaveBeenCalledWith(newUser);
    });
  });

  // Testes para o método update()
  describe('update', () => {
    it('Deve atualizar e retornar o usuário', async () => {
      const updateUserDto: UpdateUserDto = { name: 'Updated Name' };
      const updatedUser = {
        id: 1,
        name: 'Updated Name',
        email: 'test@test.com',
      };

      mockUserRepository.preload.mockResolvedValue(updatedUser);
      mockUserRepository.save.mockResolvedValue(updatedUser);

      const result = await service.update(1, updateUserDto);

      expect(result).toEqual(updatedUser);
      expect(repository.preload).toHaveBeenCalledWith({
        id: 1,
        ...updateUserDto,
      });
      expect(repository.save).toHaveBeenCalledWith(updatedUser);
    });

    it('Deve lançar NotFoundException se usuário pra atualizar não for encontrado', async () => {
      mockUserRepository.preload.mockResolvedValue(null);

      await expect(service.update(99, { name: 'any' })).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  // Testes para o método remove()
  describe('remove', () => {
    it('Deve remover um usuário com sucesso', async () => {
      const user = { id: 1, name: 'Test User', email: 'test@test.com' };
      mockUserRepository.findOneBy.mockResolvedValue(user); // findOne é chamado dentro de remove
      mockUserRepository.remove.mockResolvedValue(user);

      await service.remove(1);

      expect(repository.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(repository.remove).toHaveBeenCalledWith(user);
    });

    it('Deve lançar NotFoundException se usuário para remoção não for encontrado', async () => {
      mockUserRepository.findOneBy.mockResolvedValue(null);

      await expect(service.remove(99)).rejects.toThrow(NotFoundException);
    });
  });
});
