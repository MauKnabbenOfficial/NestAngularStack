import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { EnrollmentsService } from '../../enrollments.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { filter, Subject, switchMap, takeUntil } from 'rxjs';
import { ConfirmDialog } from '../../../../components/confirm-dialog/confirm-dialog';
import { Enrollments } from '../../enrollment.model';

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
export class EnrollmentList implements OnInit, OnDestroy {
  private enrollmentService = inject(EnrollmentsService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  private destroy$ = new Subject<void>(); // Subject para gerenciar o ciclo de vida

  enrollments: Enrollments[] = [];

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.enrollmentService
      .getAll()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.enrollments = data;
      });
  }

  deleteEnrollment(id: number): void {
    const dialogRef = this.dialog.open(ConfirmDialog, {
      data: {
        title: 'Confirmar Exclusão',
        message: `Você tem certeza que deseja excluir a matrícula? Esta ação não pode ser desfeita.`,
      },
    });

    dialogRef
      .afterClosed()
      .pipe(
        filter((result) => result === true),
        switchMap(() => this.enrollmentService.deleteEnrollment(id.toString())), // Troca para o observable de exclusão
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.enrollments = this.enrollments.filter((enrollment) => enrollment.id !== id);
        this.snackBar.open(`Matrícula excluída com sucesso!`, 'Fechar', {
          duration: 3000,
        });
      });

    /**
     * Explicação:
     * 1. Abre o diálogo de confirmação.
     * 2. Usa afterClosed() para esperar o fechamento do diálogo e obter o resultado.
     * 3. Se o resultado for true (usuário confirmou), chama o serviço para excluir o usuário.
     * "Ok, o usuário confirmou. Esqueça a tarefa 'esperar pelo diálogo' e agora troque o foco para esta nova tarefa assíncrona: this.usersService.deleteUser(id)"
     *
     * Exemplo clássico: Em um campo de busca (auto-complete), a cada letra que o usuário digita (novo valor), você faz uma requisição HTTP. Usando switchMap, se
     * o usuário digitar "angular" rapidamente, a requisição para "a", "an", "ang", etc., são automaticamente canceladas, e apenas a última ("angular") é mantida.
     * Isso economiza recursos e evita resultados de busca antigos e irrelevantes.
     */
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
