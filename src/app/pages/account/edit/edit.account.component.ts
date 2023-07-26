import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormGroup, ValidationErrors } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subject, take, takeUntil } from 'rxjs';

import { FormComponent } from '@core';
import { FormModel } from '@model';
import { CodeTypeFacade, GlobalFacade, RoleFacade, UserFacade } from '@store';
import { getLanguage } from '@utils';

@Component({
  selector: 'app-edit-account',
  templateUrl: './edit.account.component.html',
  providers: [UserFacade, CodeTypeFacade, RoleFacade],
})
export class EditAccountComponent implements OnInit, OnDestroy {
  @ViewChild('form') form!: FormComponent;
  private destroyed$ = new Subject<void>();
  id = '';
  isCustomer?: boolean;
  columnsForm: FormModel[] = [];
  language = getLanguage();

  constructor(
    protected translate: TranslateService,
    protected route: ActivatedRoute,
    public userFacade: UserFacade,
    protected router: Router,
    protected globalFacade: GlobalFacade,
    protected codeTypeFacade: CodeTypeFacade,
    protected roleFacade: RoleFacade,
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
      this.roleFacade.rolesCustomer({ page: 1, size: 10 });
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
      this.roleFacade.rolesInternal({ page: 1, size: 10 });
    }

    this.id = this.route.snapshot.params.id;
    if (this.id) {
      this.userFacade.getById(this.id);
    }
    this.codeTypeFacade.getListGender({ page: 1, size: 10 });

    this.userFacade.status$.pipe(takeUntil(this.destroyed$)).subscribe((status) => {
      switch (status) {
        case 'putOk':
        case 'postOk':
          this.handleBack();
          break;
      }
    });
    this.columnsForm = [
      {
        name: 'name',
        title: 'routes.admin.user.userName',
        formItem: {
          col: this.id ? 6 : 12,
          rules: [{ type: 'required' }],
        },
      },
      {
        name: 'email',
        title: 'Email',
        formItem: !this.id
          ? {
              col: 6,
              rules: [{ type: 'required' }, { type: 'email' }],
            }
          : undefined,
      },
      {
        name: 'phoneNumber',
        title: 'routes.admin.user.phoneNumber',
        formItem: {
          col: 6,
          type: 'number',
          rules: [{ type: 'required' }, { type: 'minlength', value: 8 }, { type: 'maxlength', value: 12 }],
        },
      },
      {
        name: 'gender',
        title: 'routes.admin.user.gender',
        formItem: {
          col: 6,
          type: 'select',
          rules: [{ type: 'required' }],
          facade: this.codeTypeFacade.getListGender$,
        },
      },
      {
        name: 'role',
        title: 'routes.admin.user.role',
        formItem: {
          col: 6,
          type: 'select',
          rules: [{ type: 'required' }],
          facade: this.roleFacade.rolesCustomer$,
        },
      },
      {
        name: 'password',
        title: 'routes.admin.user.password',
        formItem: !this.id
          ? {
              col: 6,
              rules: [{ type: 'required' }],
              type: 'password',
            }
          : undefined,
      },
      {
        name: 'confirmPassword',
        title: 'routes.admin.user.confirmPassword',
        formItem: !this.id
          ? {
              col: 6,
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
            }
          : undefined,
      },
    ];
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  handleSubmit(form: FormGroup) {
    if (form.valid) {
      const data = {
        ...form.value,
        roleListCode: [form.get('role')?.value],
      };
      this.id ? this.userFacade.put(this.id, data) : this.userFacade.post(data);
    }
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
}
