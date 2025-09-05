import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDividerModule,
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  readonly techs = [
    { icon: 'code', label: 'NestJS' },
    { icon: 'web', label: 'Angular' },
    { icon: 'storage', label: 'PostgreSQL' },
    { icon: 'dns', label: 'MongoDB' },
    { icon: 'developer_board', label: 'Docker' },
    { icon: 'view_in_ar', label: 'Docker Compose' },
  ];

  readonly features = [
    {
      icon: 'menu_book',
      title: 'Cursos',
      desc: 'CRUD completo com validações, paginação e busca.',
      link: '/courses',
      cta: 'Ver cursos',
    },
    {
      icon: 'how_to_reg',
      title: 'Matrículas',
      desc: 'Fluxo de matrícula com feedback visual e auditoria.',
      link: '/enrollments',
      cta: 'Gerenciar',
    },
    {
      icon: 'shield',
      title: 'Autenticação/Autorização',
      desc: 'Guards, interceptors e RBAC integrados.',
      link: '/auth',
      cta: 'Configurar',
    },
  ];
}
