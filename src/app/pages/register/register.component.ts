import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { GlobalFacade } from '@store';
import { FormModel } from '@model';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent {
  constructor(protected router: Router, protected route: ActivatedRoute, public globalFacade: GlobalFacade) {}

  submitForm(validateForm: FormGroup): void {
    if (validateForm.status === 'VALID') {
      this.globalFacade.register(validateForm.value);
    }
  }

  columns: FormModel[] = [
    {
      name: 'email',
      title: 'routes.auth.register.email',
      formItem: {
        rules: [
          {
            type: 'required',
          },
        ],
        col: 6,
      },
    },
    {
      name: 'name',
      title: 'routes.auth.register.name',
      formItem: {
        rules: [
          {
            type: 'required',
          },
        ],
        col: 6,
      },
    },
    {
      name: 'phoneNumber',
      title: 'routes.auth.register.phoneNumber',
      formItem: {
        rules: [
          {
            type: 'required',
          },
        ],
        col: 6,
      },
    },
    {
      name: 'team',
      title: 'routes.auth.register.team',
      formItem: {
        rules: [
          {
            type: 'required',
          },
        ],
        col: 6,
      },
    },
    {
      name: 'password',
      title: 'routes.auth.register.password',
      formItem: {
        type: 'password',
        confirm: true,
        rules: [
          {
            type: 'required',
          },
        ],
      },
    },
  ];
}
