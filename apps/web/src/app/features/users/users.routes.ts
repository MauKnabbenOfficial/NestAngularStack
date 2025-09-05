import { Routes } from '@angular/router';
import { UserList } from './components/user-list/user-list';
import { UserForm } from './components/user-form/user-form';

export const USERS_ROUTES: Routes = [
  { path: '', component: UserList }, // Rota padrão (ex: /users)
  { path: 'new', component: UserForm }, // Rota para criar (ex: /users/new)
  { path: ':id/edit', component: UserForm }, // Rota para editar (ex: /users/1/edit)
];
