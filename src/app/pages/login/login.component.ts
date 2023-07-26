import { Component, ViewEncapsulation, HostListener, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { FormModel } from '@model';
import { GlobalFacade } from '@store';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  columns: FormModel[] = [
    {
      name: 'username',
      title: 'routes.auth.login.loginName',
      formItem: {
        rules: [
          {
            type: 'required',
          },
        ],
      },
    },
    {
      name: 'password',
      title: 'routes.auth.login.password',
      formItem: {
        type: 'password',
        rules: [
          {
            type: 'required',
          },
        ],
      },
    },
    {
      name: 'rememberMe',
      title: 'routes.auth.login.remember',
      formItem: {
        type: 'checkbox',
      },
    },
  ];

  constructor(public globalFacade: GlobalFacade) {}

  @HostListener('document:keydown.enter', ['$event']) onKeydownHandler() {
    <HTMLElement>(<unknown>document.getElementById('button-submit')?.click());
  }

  submitForm(validateForm: FormGroup): void {
    if (validateForm.status === 'VALID') {
      this.globalFacade.login(validateForm.value);
    }
  }
}
