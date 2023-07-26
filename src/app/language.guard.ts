import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';

import { environment } from '@src/environments/environment';

@Injectable({ providedIn: 'root' })
export class LanguageGuard {
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const pathName = state.url.split('/');
    if (environment.languages.indexOf(pathName[1]) === -1) {
      pathName[1] = localStorage.getItem('ng-language') || environment.language;
      this.router.navigate([pathName.join('/')]);
      return false;
    }
    return true;
  }
}
