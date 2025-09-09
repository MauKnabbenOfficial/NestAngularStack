import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  if (token) {
    // 2. Clona a requisição original e adiciona o novo cabeçalho
    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });

    // 3. Deixa a requisição clonada (e modificada) continuar seu caminho
    return next(cloned);
  }

  // 4. Se não há token, deixa a requisição original passar sem modificação
  return next(req);
};
