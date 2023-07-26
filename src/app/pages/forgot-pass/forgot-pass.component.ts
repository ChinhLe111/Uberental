import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup } from '@angular/forms';

import { FormModel } from '@model';

@Component({
  selector: 'app-forgot-pass',
  templateUrl: './forgot-pass.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForgotPassComponent {
  isLoading = false;
  columns: FormModel[] = [
    {
      name: 'email',
      title: 'Email',
      formItem: {
        rules: [
          {
            type: 'required',
          },
        ],
      },
    },
  ];

  constructor(protected router: Router, protected route: ActivatedRoute) {}

  submitForm(validateForm: FormGroup): void {
    if (validateForm.status === 'VALID') {
      this.isLoading = true;
      // this.global
      //   .forgotPass(validateForm.value)
      //   .pipe(finalize(() => (this.isLoading = false)))
      //   .subscribe(() => {
      //     this.router.navigate(['/auth']);
      //   });
    }
  }
}
