import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environments';
import { Course, CreateCourse, UpdateCourse } from './course.model';

@Injectable({
  providedIn: 'root',
})
export class CoursesService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/courses`;

  getAll() {
    return this.http.get<Course[]>(this.apiUrl);
  }

  getCourseById(courseId: string) {
    return this.http.get<Course>(`${this.apiUrl}/${courseId}`);
  }

  createCourse(data: CreateCourse) {
    return this.http.post<Course>(this.apiUrl, data);
  }

  deleteCourse(courseId: string) {
    return this.http.delete(`${this.apiUrl}/${courseId}`);
  }

  updateCourse(courseId: string, data: UpdateCourse) {
    return this.http.patch<Course>(`${this.apiUrl}/${courseId}`, data);
  }
}
