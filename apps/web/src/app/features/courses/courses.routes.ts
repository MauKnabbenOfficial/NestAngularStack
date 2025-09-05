import { Routes } from '@angular/router';
import { CourseList } from './components/course-list/course-list';
import { CourseForm } from './components/course-form/course-form';

export const COURSES_ROUTES: Routes = [
  { path: '', component: CourseList },
  { path: 'new', component: CourseForm },
  { path: ':id/edit', component: CourseForm },
];
