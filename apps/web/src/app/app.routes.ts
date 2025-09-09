import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Users } from './features/users/users/users';
import { Courses } from './features/courses/courses/courses';
import { Enrollments } from './features/enrollments/enrollments/enrollments';
import { Auth } from './pages/auth/auth';
import { authGuard } from './auth/auth.guard';

// export const routes: Routes = [];
export const routes: Routes = [
  { path: 'login', component: Auth },
  { path: '', component: Home, canActivate: [authGuard] },
  {
    path: 'users',
    component: Users,
    canActivate: [authGuard],
    // Carrega as rotas filhas definidas em users.routes.ts
    loadChildren: () => import('./features/users/users.routes').then((m) => m.USERS_ROUTES),
  },
  {
    path: 'courses',
    component: Courses,
    canActivate: [authGuard],
    loadChildren: () => import('./features/courses/courses.routes').then((m) => m.COURSES_ROUTES),
  },
  {
    path: 'enrollments',
    component: Enrollments,
    canActivate: [authGuard],
    loadChildren: () =>
      import('./features/enrollments/enrollments.routes').then((m) => m.ENROLLMENTS_ROUTES),
  },
  { path: '**', redirectTo: 'login' },
];
