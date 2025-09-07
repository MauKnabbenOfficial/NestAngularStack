import { Course } from '../courses/course.model';
import { User } from '../users/user.model';

export interface Enrollments {
  id: number;
  user: User;
  course: Course;
}

export interface CreateEnrollment {
  userId: number;
  courseId: number;
}

export interface UpdateEnrollment {
  userId?: number;
  courseId?: number;
}
