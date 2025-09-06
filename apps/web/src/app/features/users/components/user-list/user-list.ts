import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { UsersService } from '../../users.service';
import { Subject } from 'rxjs';
import { takeUntil, filter, switchMap } from 'rxjs/operators';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConfirmDialog } from '../../../../components/confirm-dialog/confirm-dialog';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { User } from '../../user.model';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

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
    MatDialogModule,
    MatSnackBarModule,
  ],
  templateUrl: './user-list.html',
  styleUrl: './user-list.scss',
})
export class UserList implements OnInit, OnDestroy {
  private usersService = inject(UsersService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  private destroy$ = new Subject<void>(); // Subject para gerenciar o ciclo de vida

  users: User[] = [];

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.usersService
      .getAll()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.users = data;
      });
  }

  deleteUser(id: number, name: string): void {
    const dialogRef = this.dialog.open(ConfirmDialog, {
      data: {
        title: 'Confirmar Exclusão',
        message: `Você tem certeza que deseja excluir o usuário "${name}"? Esta ação não pode ser desfeita.`,
      },
    });

    dialogRef
      .afterClosed()
      .pipe(
        filter((result) => result === true), // Prossiga apenas se o usuário clicou em "Confirmar"
        switchMap(() => this.usersService.deleteUser(id.toString())), // Troca para o observable de exclusão
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.users = this.users.filter((user) => user.id !== id);
        this.snackBar.open(`Usuário "${name}" excluído com sucesso!`, 'Fechar', {
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
