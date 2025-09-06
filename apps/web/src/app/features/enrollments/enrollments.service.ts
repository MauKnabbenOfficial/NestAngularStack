import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environments';

export interface Enrollments {
  id: number;
  userId: number;
  courseId: number;
}

@Injectable({
  providedIn: 'root',
})
export class EnrollmentsService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/enrollments`;

  getAll() {
    return this.http.get<Enrollments[]>(this.apiUrl);
  }

  getEnrollmentById(enrollmentId: string) {
    return this.http.get<Enrollments>(`${this.apiUrl}/${enrollmentId}`);
  }

  createEnrollment(enrollmentData: Enrollments) {
    return this.http.post<Enrollments>(this.apiUrl, enrollmentData);
  }

  deleteEnrollment(enrollmentId: string) {
    return this.http.delete(`${this.apiUrl}/${enrollmentId}`);
  }

  updateEnrollment(enrollmentId: string, enrollmentData: Enrollments) {
    return this.http.patch<Enrollments>(`${this.apiUrl}/${enrollmentId}`, enrollmentData);
  }
}
