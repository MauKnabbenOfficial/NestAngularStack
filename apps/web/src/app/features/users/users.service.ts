import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environments';

export interface User {
  id: number;
  name: string;
  email: string;
}

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/users`;

  getUsers() {
    return this.http.get<User[]>(this.apiUrl);
  }

  createUser(userData: { name: string; email: string }) {
    return this.http.post<User>(this.apiUrl, userData);
  }
}
