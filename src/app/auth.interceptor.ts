import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, catchError, exhaustMap, take } from 'rxjs';

import { GlobalFacade } from '@store';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private router: Router, public globalFacade: GlobalFacade) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.globalFacade.user$.pipe(
      take(1),
      exhaustMap((user) => {
        const setHeaders: { Authorization?: string; 'x-language': string } = {
          'x-language': localStorage.getItem('ng-language') || 'en',
        };
        if (!req.headers.get('Authorization')) {
          setHeaders['Authorization'] = 'Bearer ' + (user ? user.tokenString : '');
        }
        return next.handle(req.clone({ setHeaders })).pipe(
          catchError((error: HttpErrorResponse) => {
            if (error.status === 401) {
              this.router.navigate(['/auth']);
            }
            return throwError(error);
          }),
        );
      }),
    );
  }
}
