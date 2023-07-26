import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup } from '@angular/forms';

import { CodeTypes, CodeTypesFacade, GlobalFacade } from '@store';
import { MedicalProcedureFacade } from '@src/app/store/admin/medical-procedure.store';
import { FormModel } from '@model';
import { Subject, take, takeUntil } from 'rxjs';
import { getLanguage } from '@utils';

@Component({
  selector: 'app-edit-medical-procedure',
  templateUrl: './edit.medical-procedure.component.html',
  styleUrls: ['./edit.medical-procedure.component.less'],
  providers: [MedicalProcedureFacade, CodeTypesFacade, GlobalFacade],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditMedicalProcedureComponent implements OnInit, OnDestroy {
  constructor(
    protected route: ActivatedRoute,
    protected router: Router,
    private cdr: ChangeDetectorRef,
    private globalFacade: GlobalFacade,
    public medicalProcedureFacade: MedicalProcedureFacade,
    public codeTypesFacade: CodeTypesFacade,
  ) {}

  filterMedicalGroup: CodeTypes[] = [];
  language = getLanguage();
  private destroyed$ = new Subject<void>();

  ngOnInit(): void {
    const { id } = this.route.snapshot.params;
    this.globalFacade.setBreadcrumbs([
      {
        title: 'routes.admin.medical-procedure.CATEGORY_MANAGEMENT',
        link: '/medical-procedure',
      },
      {
        title: 'routes.admin.medical-procedure.' + (id ? 'edit_trick' : 'add_trick'),
        link: '/medical-procedure',
      },
    ]);
    this.codeTypesFacade.get({
      size: -1,
      filter: JSON.stringify({ type: 'MEDICAL_PROCEDURE_GROUP' }),
    });
    this.codeTypesFacade.pagination$.pipe(takeUntil(this.destroyed$)).subscribe((data) => {
      if (data && data.content.length > 0) {
        this.filterMedicalGroup = data.content;
        if (id) {
          this.medicalProcedureFacade.getById(id);
        } else {
          this.medicalProcedureFacade.setData();
        }
        this.form();
      }
    });
    this.medicalProcedureFacade.status$.pipe(takeUntil(this.destroyed$)).subscribe((status) => {
      switch (status) {
        case 'postOk':
        case 'putOk':
          this.handleBack();
          break;
      }
    });
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  handleBack() {
    this.medicalProcedureFacade.setId(this.route.snapshot.params.id);
    this.medicalProcedureFacade.query$.pipe(take(1)).subscribe((query) => {
      this.router.navigate([this.language + '/medical-procedure'], {
        relativeTo: this.route,
        queryParams: query || {},
        queryParamsHandling: 'merge',
      });
    });
  }

  handelSubmit(validateForm: FormGroup) {
    const { id } = this.route.snapshot.params;
    const { status } = validateForm;
    if (status == 'VALID') {
      if (id) this.medicalProcedureFacade.put(id, validateForm.value);
      else this.medicalProcedureFacade.post(validateForm.value);
    }
  }

  columnsForm: FormModel[] = [];

  private form() {
    this.columnsForm = [
      {
        name: 'name',
        title: 'routes.admin.medical-procedure.title',
        formItem: {
          rules: [{ type: 'required' }],
        },
      },
      {
        name: 'code',
        title: 'routes.admin.medical-procedure.code',
        formItem: {
          col: 6,
          rules: [{ type: 'required' }],
        },
      },
      {
        name: 'groupCode',
        title: 'routes.admin.medical-procedure.medical_procedure_group',
        formItem: {
          type: 'select',
          rules: [{ type: 'required' }],
          col: 6,
          list: this.filterMedicalGroup.map((i) => ({ value: i.code, label: i.title })) || [],
        },
      },
      {
        name: 'depositPercentage',
        title: 'routes.admin.medical-procedure.deposit_percentage',
        formItem: {
          col: 6,
          type: 'number',
          rules: [{ type: 'required' }, { type: 'min', value: 1 }, { type: 'max', value: 100 }],
        },
      },
      {
        name: 'baseCommissionAmount',
        title: 'routes.admin.medical-procedure.base_commission_amount',
        formItem: {
          col: 6,
          type: 'mask',
          rules: [{ type: 'required' }, { type: 'min', value: 1 }],
          mask: 'separator.3',
        },
      },
      {
        name: 'isOneTimeProcedure',
        title: 'routes.admin.medical-procedure.is_one_time_procedure',
        formItem: {
          type: 'switch',
        },
      },
    ];
  }
}
