import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormGroup, ValidationErrors } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormComponent } from '@core/form/form.component';
import { FormModel } from '@model';
import { TranslateService } from '@ngx-translate/core';
import { GlobalFacade, UserFacade } from '@store';
import { getLanguage } from '@utils';
import { Subject, take, takeUntil } from 'rxjs';

@Component({
  selector: 'app-password-account',
  templateUrl: './password.account.component.html',
  providers: [UserFacade],
})
export class PasswordAccountComponent implements OnInit, OnDestroy {
  isCustomer?: boolean;
  private destroyed$ = new Subject<void>();
  @ViewChild('form') form!: FormComponent;
  language = getLanguage();

  constructor(
    protected translate: TranslateService,
    protected route: ActivatedRoute,
    protected userFacade: UserFacade,
    protected router: Router,
    protected globalFacade: GlobalFacade,
  ) {}

  ngOnInit(): void {
    if (this.route.snapshot.routeConfig?.path?.slice(0, 8) == 'customer') {
      this.isCustomer = true;
      this.globalFacade.setBreadcrumbs([
        {
          title: 'routes.admin.user.manageAccount',
          link: '/navigation',
        },
        {
          title: 'routes.admin.user.customerAccount',
          link: '/customer-account',
        },
      ]);
    } else {
      this.isCustomer = false;
      this.globalFacade.setBreadcrumbs([
        {
          title: 'routes.admin.user.manageAccount',
          link: '/navigation',
        },
        {
          title: 'routes.admin.user.internalAccount',
          link: '/internal-account',
        },
      ]);
    }
    this.userFacade.status$.pipe(takeUntil(this.destroyed$)).subscribe((status) => {
      switch (status) {
        case 'putPasswordOk':
          this.handleBack();
          break;
      }
    });
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  handleSubmit(form: FormGroup) {
    const id = this.route.snapshot.params.id;
    if (form.valid) this.userFacade.putPassword(id, form.get('password')?.value);
  }

  handleBack() {
    this.userFacade.setId(this.route.snapshot.params.id);
    this.userFacade.query$.pipe(takeUntil(this.destroyed$), take(1)).subscribe((query) => {
      this.router.navigate(
        this.isCustomer ? [this.language + '/customer-account'] : [this.language + '/internal-account'],
        !!query
          ? {
              relativeTo: this.route,
              queryParams: query,
              queryParamsHandling: 'merge',
            }
          : {},
      );
    });
  }

  columnsForm: FormModel[] = [
    {
      name: 'password',
      title: 'routes.admin.user.password',
      formItem: {
        rules: [{ type: 'required' }],
        type: 'password',
      },
    },
    {
      name: 'confirmPassword',
      title: 'routes.admin.user.confirmPassword',
      formItem: {
        rules: [
          { type: 'required' },
          {
            type: 'custom',
            validator: ({ value }: AbstractControl): ValidationErrors | null => {
              if (this.form && !!value && value !== this.form.validateForm.get('password')?.value)
                return { custom: true };
              return null;
            },
            message: 'routes.admin.user.messageConfirmPassword',
          },
        ],
        type: 'password',
      },
    },
  ];
}
