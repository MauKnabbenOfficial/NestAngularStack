import { Component, inject, OnInit } from '@angular/core';
import { User, UsersService } from '../../users.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatCardModule,
    MatDividerModule,
  ],
  templateUrl: './user-list.html',
  styleUrl: './user-list.scss',
})
export class UserList implements OnInit {
  private usersService = inject(UsersService);
  users: User[] = [];

  ngOnInit(): void {
    this.users.push(
      { id: 1, name: 'John Doe', email: 'Ola' },
      { id: 2, name: 'Jane Smith', email: 'Mundo' },
      { id: 3, name: 'Jane Smith', email: 'Mundo' },
      { id: 4, name: 'Jane Smith', email: 'Mundo' },
      { id: 5, name: 'Jane Smith', email: 'Mundo' }
    );

    // this.usersService.getUsers().subscribe((data) => {
    //   this.users = data;
    // });
  }
}
