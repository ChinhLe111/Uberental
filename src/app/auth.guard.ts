import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable, take, tap } from 'rxjs';

import { environment } from '@src/environments/environment';
import { GlobalFacade } from '@store';

@Injectable({ providedIn: 'root' })
export class AuthGuard {
  constructor(private router: Router, public globalFacade: GlobalFacade) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.globalFacade.isLoggedIn$.pipe(
      take(1),
      tap((isLoggedIn) => {
        if (!isLoggedIn) {
          this.router.navigate([(localStorage.getItem('ng-language') || environment.language) + '/auth/login'], {
            queryParams: { returnUrl: state.url },
          });
        }
      }),
    );
  }
}
