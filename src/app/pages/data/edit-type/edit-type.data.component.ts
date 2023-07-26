import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { FormModel } from '@model';
import { DataTypesFacade, GlobalFacade } from '@store';
import { getLanguage } from '@utils';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-edit-type-data',
  templateUrl: './edit-type.data.component.html',
  providers: [DataTypesFacade],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditTypeDataComponent implements OnInit, OnDestroy {
  columnsForm: FormModel[] = [];
  id?: string;
  language = getLanguage();

  constructor(
    private globalFacade: GlobalFacade,
    protected route: ActivatedRoute,
    public dataTypesFacade: DataTypesFacade,
    protected router: Router,
  ) {}

  private destroyed$ = new Subject<void>();

  ngOnInit() {
    this.globalFacade.setBreadcrumbs([
      {
        title: 'QUẢN LÝ DANH MỤC',
        link: '/data',
      },
      {
        title: 'Quản lý dữ liệu',
        link: '/data',
      },
    ]);
    const { id } = this.route.snapshot.params;
    this.id = id;
    if (id) this.dataTypesFacade.getById(id);
    else this.dataTypesFacade.setId(null);
    this.columnsForm = [
      {
        name: 'name',
        title: 'routes.admin.Layout.Name',
        formItem: {
          rules: [{ type: 'required' }],
        },
      },
      {
        name: 'code',
        title: 'routes.admin.Layout.Code',
        formItem: {
          rules: [{ type: 'required' }],
        },
      },
    ];
    this.dataTypesFacade.status$.pipe(takeUntil(this.destroyed$)).subscribe((status) => {
      switch (status) {
        case 'postOk':
        case 'putOk':
          this.router.navigate([this.language + '/data']);
      }
    });
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  handelSubmit(validateForm: FormGroup) {
    const { id } = this.route.snapshot.params;
    const { valid } = validateForm;
    if (valid) {
      if (id) {
        this.dataTypesFacade.put(id, validateForm.value);
      } else {
        this.dataTypesFacade.post(validateForm.value);
      }
    }
  }
}
