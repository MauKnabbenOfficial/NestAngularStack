import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environments';

export interface Course {
  id: number;
  title: string;
}

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/users`;

  getAll() {
    return this.http.get<Course[]>(this.apiUrl);
  }

  insert(data: { id: number; title: string }) {
    return this.http.post<Course>(this.apiUrl, data);
  }
}
