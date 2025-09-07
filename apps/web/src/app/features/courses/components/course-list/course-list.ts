import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { CoursesService } from '../../courses.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { filter, Subject, switchMap, takeUntil } from 'rxjs';
import { ConfirmDialog } from '../../../../components/confirm-dialog/confirm-dialog';
import { Course } from '../../course.model';

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
export class CourseList implements OnInit, OnDestroy {
  private coursesService = inject(CoursesService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  private destroy$ = new Subject<void>(); // Subject para gerenciar o ciclo de vida

  courses: Course[] = [];

  ngOnInit(): void {
    this.loadCourses();
  }

  loadCourses(): void {
    this.coursesService
      .getAll()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.courses = data;
      });
  }

  deleteCourse(id: number, title: string): void {
    const dialogRef = this.dialog.open(ConfirmDialog, {
      data: {
        title: 'Confirmar Exclusão',
        message: `Você tem certeza que deseja excluir o curso "${title}"? Esta ação não pode ser desfeita.`,
      },
    });

    dialogRef
      .afterClosed()
      .pipe(
        filter((result) => result === true),
        switchMap(() => this.coursesService.deleteCourse(id.toString())),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.courses = this.courses.filter((course) => course.id !== id);
        this.snackBar.open(`Curso "${title}" excluído com sucesso!`, 'Fechar', {
          duration: 3000,
        });
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
