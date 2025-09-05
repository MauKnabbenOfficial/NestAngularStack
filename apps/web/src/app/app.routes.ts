import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Users } from './features/users/users/users';
import { Courses } from './features/courses/courses/courses';
import { Enrollments } from './features/enrollments/enrollments/enrollments';

// export const routes: Routes = [];
export const routes: Routes = [
  { path: '', component: Home },
  {
    path: 'users',
    component: Users,
    // Carrega as rotas filhas definidas em users.routes.ts
    loadChildren: () => import('./features/users/users.routes').then((m) => m.USERS_ROUTES),
  },
  {
    path: 'courses',
    component: Courses,
    loadChildren: () => import('./features/courses/courses.routes').then((m) => m.COURSES_ROUTES),
  },
  {
    path: 'enrollments',
    component: Enrollments,
    loadChildren: () =>
      import('./features/enrollments/enrollments.routes').then((m) => m.ENROLLMENTS_ROUTES),
  },
];
