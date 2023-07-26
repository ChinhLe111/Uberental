import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.layout.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthLayout {
  constructor(public translate: TranslateService, protected router: Router) {}

  changeLanguage(value: string): void {
    const pathName = location.pathname.split('/');
    pathName[1] = value;
    this.router.navigate([pathName.join('/')]);
  }
}
