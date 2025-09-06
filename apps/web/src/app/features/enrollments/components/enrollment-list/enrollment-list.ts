import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { Enrollments } from '../../enrollments.service';

@Component({
  selector: 'app-enrollment-list',
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
  templateUrl: './enrollment-list.html',
  styleUrl: './enrollment-list.scss',
})
export class EnrollmentList implements OnInit {
  // private usersService = inject(UsersService);
  enrollments: Enrollments[] = [];
  ngOnInit(): void {
    // this.enrollments.push(
    //   { courseId: 1, userId: 1 },
    //   { courseId: 2, userId: 2 },
    //   { courseId: 3, userId: 3 },
    //   { courseId: 4, userId: 4 },
    //   { courseId: 5, userId: 5 }
    // );
  }
}
