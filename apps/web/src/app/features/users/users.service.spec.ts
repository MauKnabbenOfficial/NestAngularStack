import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { UsersService } from './users.service';
import { User, CreateUser, UpdateUser } from './user.model';
import { environment } from '../../../environments/environments';
import { provideHttpClient } from '@angular/common/http';

describe('UsersService', () => {
  let service: UsersService;
  let httpMock: HttpTestingController;
  const apiUrl = `${environment.apiUrl}/users`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      // A nova abordagem usa providers em vez de importar um módulo de teste.
      providers: [provideHttpClient(), provideHttpClientTesting(), UsersService],
    });
    service = TestBed.inject(UsersService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  // Garante que não há requisições pendentes entre os testes
  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // Teste para o método getAll()
  it('should retrieve all users from the API via GET', () => {
    const dummyUsers: User[] = [
      { id: 1, name: 'John Doe', email: 'john@example.com' },
      { id: 2, name: 'Jane Doe', email: 'jane@example.com' },
    ];

    service.getAll().subscribe((users) => {
      expect(users.length).toBe(2);
      expect(users).toEqual(dummyUsers);
    });

    // Espera que uma requisição seja feita para a URL correta
    const request = httpMock.expectOne(apiUrl);

    // Verifica se o método da requisição é GET
    expect(request.request.method).toBe('GET');

    // Responde à requisição com os dados mockados
    request.flush(dummyUsers);
  });

  // Teste para o método getUserById()
  it('should retrieve a single user from the API via GET', () => {
    const dummyUser: User = { id: 1, name: 'John Doe', email: 'john@example.com' };

    service.getUserById('1').subscribe((user) => {
      expect(user).toEqual(dummyUser);
    });

    const request = httpMock.expectOne(`${apiUrl}/1`);
    expect(request.request.method).toBe('GET');
    request.flush(dummyUser);
  });

  // Teste para o método createUser()
  it('should create a user and return it via POST', () => {
    const newUser: CreateUser = { name: 'New User', email: 'new@example.com' };
    const createdUser: User = { id: 3, ...newUser };

    service.createUser(newUser).subscribe((user) => {
      expect(user).toEqual(createdUser);
    });

    const request = httpMock.expectOne(apiUrl);
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual(newUser); // Verifica se o corpo da requisição está correto
    request.flush(createdUser);
  });

  // Teste para o método updateUser()
  it('should update a user and return it via PATCH', () => {
    const updateUser: UpdateUser = { name: 'Updated Name' };
    const updatedUser: User = { id: 1, name: 'Updated Name', email: 'john@example.com' };

    service.updateUser('1', updateUser).subscribe((user) => {
      expect(user).toEqual(updatedUser);
    });

    const request = httpMock.expectOne(`${apiUrl}/1`);
    expect(request.request.method).toBe('PATCH');
    expect(request.request.body).toEqual(updateUser);
    request.flush(updatedUser);
  });

  // Teste para o método deleteUser()
  it('should delete a user via DELETE', () => {
    service.deleteUser('1').subscribe((response) => {
      expect(response).toBeNull();
    });

    const request = httpMock.expectOne(`${apiUrl}/1`);
    expect(request.request.method).toBe('DELETE');
    request.flush(null, { status: 204, statusText: 'No Content' });
  });
});
