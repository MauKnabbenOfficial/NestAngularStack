import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, ActivatedRoute } from '@angular/router';
import { forkJoin, Subject, takeUntil } from 'rxjs';
import { EnrollmentsService } from '../../enrollments.service';
import { UsersService } from '../../../users/users.service';
import { CoursesService } from '../../../courses/courses.service';
import { Course } from '../../../courses/course.model';
import { User } from '../../../users/user.model';
import { MatSelectModule } from '@angular/material/select';
import { CreateEnrollment, UpdateEnrollment } from '../../enrollment.model';

@Component({
  selector: 'app-enrollment-form',
  imports: [
    CommonModule,
    ReactiveFormsModule, // Essencial para formulários reativos
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatToolbarModule,
    MatSnackBarModule,
    MatSelectModule,
  ],
  templateUrl: './enrollment-form.html',
  styleUrl: './enrollment-form.scss',
})
export class EnrollmentForm implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private enrollmentService = inject(EnrollmentsService);
  private usersService = inject(UsersService);
  private coursesService = inject(CoursesService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private snackBar = inject(MatSnackBar);
  private destroy$ = new Subject<void>();

  users: User[] = [];
  courses: Course[] = [];

  private enrollmentId: string | null = null;
  isEditMode = false;

  form = this.fb.group({
    userId: new FormControl<number>(0, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(1)],
    }),
    courseId: new FormControl<number>(0, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(1)],
    }),
  });

  ngOnInit(): void {
    this.enrollmentId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.enrollmentId;

    this.loadData();
    if (this.isEditMode) {
    }
  }

  loadData(): void {
    forkJoin({
      users: this.usersService.getAll(),
      courses: this.coursesService.getAll(),
    }).subscribe(({ users, courses }) => {
      this.users = users;
      this.courses = courses;
    });

    if (!this.isEditMode || !this.enrollmentId) return;

    this.enrollmentService
      .getEnrollmentById(this.enrollmentId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (enrollment) => {
          if (enrollment) {
            this.form.patchValue({
              userId: enrollment.user.id,
              courseId: enrollment.course.id,
            });
          } else {
            this.handleNotFound();
          }
        },
        error: (err) => {
          this.handleNotFound();
        },
      });
  }

  save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const enrollmentData = this.form.getRawValue();

    if (this.isEditMode && this.enrollmentId) this.update(this.enrollmentId, enrollmentData);
    else this.create(enrollmentData);
  }

  private create(data: CreateEnrollment) {
    this.enrollmentService
      .createEnrollment(data)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.snackBar.open('Matrícula criada com sucesso!', 'Fechar', { duration: 3000 });
          this.router.navigate(['/enrollments']);
        },
        error: (err) => {
          this.snackBar.open('Erro ao criar matrícula.', 'Fechar', {
            duration: 3000,
            panelClass: 'error-snackbar',
          });
          console.error('Erro ao criar matrícula:', err);
        },
      });
  }

  private update(id: string, data: UpdateEnrollment) {
    this.enrollmentService
      .updateEnrollment(id, data)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.snackBar.open('Matrícula atualizada com sucesso!', 'Fechar', { duration: 3000 });
          this.router.navigate(['/users']);
        },
        error: (err) => {
          this.snackBar.open('Erro ao atualizar matrícula.', 'Fechar', {
            duration: 3000,
            panelClass: 'error-snackbar',
          });
          console.error('Erro ao atualizar matrícula:', err);
        },
      });
  }

  cancel() {
    this.router.navigate(['/enrollments']);
  }

  private handleNotFound(): void {
    this.snackBar.open('Matrícula não encontrada.', 'Fechar', {
      duration: 3000,
    });
    this.router.navigate(['/enrollments']);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
