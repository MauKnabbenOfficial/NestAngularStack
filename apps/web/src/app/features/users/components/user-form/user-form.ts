import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, ActivatedRoute } from '@angular/router';
import { UsersService } from '../../users.service';
import { CreateUser, UpdateUser } from '../../user.model';
import { Subject, takeUntil } from 'rxjs';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-user-form',
  standalone: true, // Garantindo que é standalone
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
  templateUrl: './user-form.html',
  styleUrl: './user-form.scss',
})
export class UserForm implements OnInit, OnDestroy {
  // Injeção de dependências moderna
  private fb = inject(FormBuilder);
  private usersService = inject(UsersService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private snackBar = inject(MatSnackBar);
  private destroy$ = new Subject<void>();

  private userId: string | null = null;
  isEditMode = false;

  form = this.fb.group({
    name: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    email: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
  });

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.userId;

    if (this.isEditMode) {
      this.loadUserData();
    }
  }

  loadUserData(): void {
    if (!this.userId) return;

    this.usersService
      .getUserById(this.userId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (user) => {
          if (user) {
            this.form.patchValue(user);
          } else {
            this.handleUserNotFound();
          }
        },
        error: (err) => {
          this.handleUserNotFound();
        },
      });
  }

  save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const userData = this.form.getRawValue();

    if (this.isEditMode && this.userId) this.update(this.userId, userData);
    else this.create(userData);
  }

  private create(data: CreateUser) {
    console.log('create', data);
    this.snackBar.open('Usuário criado com sucesso!', 'Fechar', { duration: 3000 });
    return;
    this.usersService
      .createUser(data)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.snackBar.open('Usuário criado com sucesso!', 'Fechar', { duration: 3000 });
          this.router.navigate(['/users']);
        },
        error: (err) => {
          this.snackBar.open('Erro ao criar usuário.', 'Fechar', {
            duration: 3000,
            panelClass: 'error-snackbar',
          });
          console.error('Erro ao criar usuário:', err);
        },
      });
  }

  private update(id: string, data: UpdateUser) {
    console.log('update', data);
    this.snackBar.open('Usuário atualizado com sucesso!', 'Fechar', { duration: 3000 });
    return;
    this.usersService
      .updateUser(id, data)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.snackBar.open('Usuário atualizado com sucesso!', 'Fechar', { duration: 3000 });
          this.router.navigate(['/users']);
        },
        error: (err) => {
          this.snackBar.open('Erro ao atualizar usuário.', 'Fechar', {
            duration: 3000,
            panelClass: 'error-snackbar',
          });
          console.error('Erro ao atualizar usuário:', err);
        },
      });
  }

  cancel() {
    this.router.navigate(['/users']);
  }

  private handleUserNotFound(): void {
    this.snackBar.open('Usuário não encontrado.', 'Fechar', {
      duration: 3000,
    });
    this.router.navigate(['/users']);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
