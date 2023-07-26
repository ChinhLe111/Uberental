import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { FormModel } from '@model';
import { CodeTypeFacade } from '@src/app/store/code-type.store';

import { GlobalFacade, UserFacade } from '@store';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  providers: [GlobalFacade, UserFacade, CodeTypeFacade],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditProfileComponent implements OnInit {
  constructor(
    public userFacade: UserFacade,
    protected router: Router,
    public globalFacade: GlobalFacade,
    public codeTypeFacade: CodeTypeFacade,
  ) {}

  ngOnInit() {
    this.globalFacade.setBreadcrumbs([
      {
        title: 'routes.admin.user.manageProfile',
        link: '/edit-profile',
      },
    ]);
    this.globalFacade.getInfo();
    this.codeTypeFacade.getListGender({ page: 1, size: 10 });
  }

  handleSubmit(form: FormGroup, id?: string) {
    if (form.valid && id)
      this.userFacade.put(id, {
        name: form.controls['name'].value,
        gender: form.controls['gender'].value,
      });
  }

  columnsForm: FormModel[] = [
    {
      name: 'name',
      title: 'routes.admin.user.userName',
      formItem: {
        col: 6,
        rules: [{ type: 'required' }],
      },
    },
    {
      name: 'email',
      title: 'Email',

      formItem: {
        col: 6,
        rules: [{ type: 'required' }],
        readonly: true,
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
        rules: [{ type: 'required' }],
        readonly: true,
      },
    },
  ];
}
