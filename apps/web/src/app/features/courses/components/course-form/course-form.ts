import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { CoursesService } from '../../courses.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { CreateCourse, UpdateCourse } from '../../course.model';

@Component({
  selector: 'app-course-form',
  imports: [
    CommonModule,
    ReactiveFormsModule, // Essencial para formulários reativos
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatToolbarModule,
    MatSnackBarModule,
  ],
  templateUrl: './course-form.html',
  styleUrl: './course-form.scss',
})
export class CourseForm implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private coursesService = inject(CoursesService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private snackBar = inject(MatSnackBar);
  private destroy$ = new Subject<void>();

  private courseId: string | null = null;
  isEditMode = false;

  form = this.fb.group({
    title: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
  });

  ngOnInit(): void {
    this.courseId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.courseId;

    if (this.isEditMode) {
      this.loadData();
    }
  }

  loadData(): void {
    if (!this.courseId) return;

    this.coursesService
      .getCourseById(this.courseId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (course) => {
          if (course) {
            this.form.patchValue(course);
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

    const courseData = this.form.getRawValue();

    if (this.isEditMode && this.courseId) this.update(this.courseId, courseData);
    else this.create(courseData);
  }

  private create(data: CreateCourse) {
    this.coursesService
      .createCourse(data)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.snackBar.open('Curso criado com sucesso!', 'Fechar', { duration: 3000 });
          this.router.navigate(['/users']);
        },
        error: (err) => {
          this.snackBar.open('Erro ao criar curso.', 'Fechar', {
            duration: 3000,
            panelClass: 'error-snackbar',
          });
          console.error('Erro ao criar curso:', err);
        },
      });
  }

  private update(id: string, data: UpdateCourse) {
    this.coursesService
      .updateCourse(id, data)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.snackBar.open('Curso atualizado com sucesso!', 'Fechar', { duration: 3000 });
          this.router.navigate(['/users']);
        },
        error: (err) => {
          this.snackBar.open('Erro ao atualizar curso.', 'Fechar', {
            duration: 3000,
            panelClass: 'error-snackbar',
          });
          console.error('Erro ao atualizar curso:', err);
        },
      });
  }

  cancel() {
    this.router.navigate(['/courses']);
  }

  private handleNotFound(): void {
    this.snackBar.open('Curso não encontrado.', 'Fechar', {
      duration: 3000,
    });
    this.router.navigate(['/courses']);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
