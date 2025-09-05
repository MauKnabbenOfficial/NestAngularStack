import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { Course } from '../../courses.service';

@Component({
  selector: 'app-course-list',
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
  templateUrl: './course-list.html',
  styleUrl: './course-list.scss',
})
export class CourseList implements OnInit {
  // private usersService = inject(UsersService);
  courses: Course[] = [];

  ngOnInit(): void {
    this.courses.push(
      { id: 1, title: 'John Doe' },
      { id: 2, title: 'John Doe' },
      { id: 3, title: 'John Doe' },
      { id: 4, title: 'John Doe' }
    );
  }
}
