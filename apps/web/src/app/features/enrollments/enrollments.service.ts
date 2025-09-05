import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environments';

export interface Enrollments {
  userId: number;
  courseId: number;
}

@Injectable({
  providedIn: 'root',
})
export class EnrollmentsService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/users`;

  getAll() {
    return this.http.get<Enrollments[]>(this.apiUrl);
  }

  insert(userData: { userId: number; courseId: number }) {
    return this.http.post<Enrollments>(this.apiUrl, userData);
  }
}
