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
  private apiUrl = `${environment.apiUrl}/courses`;

  getAll() {
    return this.http.get<Course[]>(this.apiUrl);
  }

  getCourseById(courseId: number) {
    return this.http.get<Course>(`${this.apiUrl}/${courseId}`);
  }

  createCourse(data: Course) {
    return this.http.post<Course>(this.apiUrl, data);
  }

  deleteCourse(courseId: number) {
    return this.http.delete(`${this.apiUrl}/${courseId}`);
  }

  updateCourse(courseId: number, data: Course) {
    return this.http.patch<Course>(`${this.apiUrl}/${courseId}`, data);
  }
}
