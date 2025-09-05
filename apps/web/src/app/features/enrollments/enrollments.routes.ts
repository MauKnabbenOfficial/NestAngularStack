import { Routes } from '@angular/router';
import { EnrollmentList } from './components/enrollment-list/enrollment-list';
import { EnrollmentForm } from './components/enrollment-form/enrollment-form';

export const ENROLLMENTS_ROUTES: Routes = [
  { path: '', component: EnrollmentList },
  { path: 'new', component: EnrollmentForm },
  { path: ':id/edit', component: EnrollmentForm },
];
