import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy } from '@angular/core';
import {
  FormControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
  ],
  templateUrl: './auth.html',
  styleUrl: './auth.scss',
})
export class Auth implements OnDestroy {
  private fb = inject(NonNullableFormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);
  private destroy$ = new Subject<void>();

  loginForm = this.fb.group({
    email: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    password: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
  });

  registerForm = this.fb.group({
    name: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    email: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    password: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(8)],
    }),
  });

  login() {
    if (this.loginForm.invalid) return;

    this.authService
      .login(this.loginForm.getRawValue())
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.router.navigate(['/']); // Navega para a home após o login
        },
        error: () => {
          this.snackBar.open('Email ou senha inválidos.', 'Fechar', { duration: 3000 });
        },
      });
  }

  register() {
    if (this.registerForm.invalid) return;

    this.authService
      .register(this.registerForm.getRawValue())
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.snackBar.open('Cadastro realizado com sucesso! Por favor, faça o login.', 'Fechar', {
            duration: 5000,
          });
          this.router.navigate(['/login']); // Redireciona para o login após o registro
        },
        error: (err) => {
          const message = err.error.message || 'Erro ao realizar o cadastro.';
          this.snackBar.open(message, 'Fechar', { duration: 3000 });
        },
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
