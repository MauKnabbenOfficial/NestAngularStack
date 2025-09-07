import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environments';
import { CreateUser, UpdateUser, User } from './user.model';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/users`;

  getAll() {
    return this.http.get<User[]>(this.apiUrl);
  }

  getUserById(userId: string) {
    return this.http.get<User>(`${this.apiUrl}/${userId}`);
  }

  createUser(userData: CreateUser) {
    return this.http.post<User>(this.apiUrl, userData);
  }

  deleteUser(userId: string) {
    return this.http.delete(`${this.apiUrl}/${userId}`);
  }

  updateUser(userId: string, userData: UpdateUser) {
    return this.http.patch<User>(`${this.apiUrl}/${userId}`, userData);
  }
}
