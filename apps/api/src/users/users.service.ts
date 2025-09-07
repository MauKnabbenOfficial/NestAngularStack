import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  create(createUserDto: CreateUserDto) {
    const user = this.repo.create(createUserDto);
    return this.repo.save(user);
  }

  findAll() {
    return this.repo.find();
  }

  async findOne(id: number) {
    const user = await this.repo.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`Usuário não encontrado.`);
    }
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    // 'preload' para buscar a entidade e aplicar as alterações do DTO
    const user = await this.repo.preload({
      id: id,
      ...updateUserDto,
    });
    if (!user) {
      throw new NotFoundException(`Usuário não encontrado.`);
    }
    return this.repo.save(user);
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    await this.repo.remove(user);
  }
}
