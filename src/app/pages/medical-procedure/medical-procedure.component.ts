import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, take, takeUntil, withLatestFrom } from 'rxjs';
import { NzMarks, NzSliderValue } from 'ng-zorro-antd/slider/typings';

import { AddressFacade, CodeTypesFacade, GlobalFacade, Province } from '@store';
import { MedicalProcedure, MedicalProcedureFacade } from '@src/app/store/admin/medical-procedure.store';
import { DataTableModel } from '@model';
import { FormatCurrencyPipe } from '@pipes';
import { getLanguage } from '@utils';

@Component({
  selector: 'app-medical-procedure',
  templateUrl: './medical-procedure.component.html',
  styleUrls: ['./medical-procedure.component.less'],
  providers: [MedicalProcedureFacade, CodeTypesFacade, AddressFacade, GlobalFacade, FormatCurrencyPipe],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MedicalProcedureComponent implements OnInit, OnDestroy {
  marks: NzMarks = {
    0: '0',
    500000: '',
    1000000: '',
    2000000: '',
    5000000: '',
    10000000: '10,000,000',
  };

  tipFormatter = (value: number) => {
    return `${this.formatCurrency.transform(value)}`;
  };

  constructor(
    protected route: ActivatedRoute,
    protected router: Router,
    private cdRef: ChangeDetectorRef,
    private formatCurrency: FormatCurrencyPipe,
    private globalFacade: GlobalFacade,
    public medicalProcedureFacade: MedicalProcedureFacade,
    public codeTypesFacade: CodeTypesFacade,
    public addressFacade: AddressFacade,
  ) {}

  @ViewChild('tableMedicalProcedure') tableMedicalProcedure!: any;
  private destroyed$ = new Subject<void>();
  id?: string = '';
  language = getLanguage();

  ngOnInit(): void {
    this.globalFacade.setBreadcrumbs([
      {
        title: 'routes.admin.medical-procedure.CATEGORY_MANAGEMENT',
        link: '/medical-procedure',
      },
      {
        title: 'routes.admin.medical-procedure.trick_type',
        link: '/medical-procedure',
      },
    ]);
    this.addressFacade.getProvinceList({});
    this.codeTypesFacade.get({
      size: -1,
      filter: JSON.stringify({ type: 'MEDICAL_PROCEDURE_GROUP' }),
    });
    const { filter } = this.route.snapshot.queryParams;
    if (filter) {
      const { PriceRange, ProvinceCode } = JSON.parse(filter);
      if (PriceRange) this.setMarks(PriceRange);
      if (ProvinceCode) {
        this.addressFacade.provinceList$.pipe(takeUntil(this.destroyed$)).subscribe((province) => {
          if (province.length > 0) {
            this.filterProvince(ProvinceCode, province);
          }
        });
      }
    }
    this.medicalProcedureFacade.status$.pipe(takeUntil(this.destroyed$)).subscribe((status) => {
      switch (status) {
        case 'deleteOk':
          this.tableMedicalProcedure.changeData();
          break;
      }
    });
    this.medicalProcedureFacade.id$.pipe(takeUntil(this.destroyed$), take(1)).subscribe((id) => {
      if (!!id) {
        this.id = id;
        this.medicalProcedureFacade.setId(null);
      }
    });
    this.table();
  }

  classRow(data: MedicalProcedure, { id }: { id: string }) {
    return data.id === id ? 'bg-blue-100' : '';
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  setMarks(value: number[]) {
    const priceRange: { [key: number]: string } = {
      0: '',
      500000: '',
      1000000: '',
      2000000: '',
      5000000: '',
      10000000: '',
    };
    value.map((item: any) => {
      priceRange[item] = `${this.formatCurrency.transform(item)}`;
    });
    this.marks = priceRange;
  }

  onAfterChange(value: NzSliderValue) {
    if (value instanceof Array) {
      this.setMarks(value);
      this.tableMedicalProcedure.filter('PriceRange', null, value);
    }
  }

  tenTinh?: string;

  filterProvince(maTinh: number, dataProvince: Province[]) {
    if (dataProvince) {
      this.tenTinh = '';
      if (this.tableMedicalProcedure) this.tableMedicalProcedure.filter('ProvinceCode', null, maTinh);
      dataProvince.map((province) => {
        if (province.maTinh == maTinh) this.tenTinh = province.tenTinh;
      });
    }
    this.table();
  }

  columnsTable: DataTableModel<MedicalProcedure>[] = [];
  @ViewChild('procedureName') procedureName!: TemplateRef<HTMLTemplateElement>;
  @ViewChild('tricksGroup') tricksGroup!: TemplateRef<HTMLTemplateElement>;

  private table() {
    setTimeout(() => {
      this.columnsTable = [
        {
          name: 'name',
          title: 'routes.admin.medical-procedure.procedure-name',
          tableItem: {
            renderTemplate: this.procedureName,
          },
        },
        {
          name: 'group',
          title: 'routes.admin.medical-procedure.procedure-group',
          tableItem: {
            width: '250px',
            align: 'center',
            renderTemplate: this.tricksGroup,
          },
        },
        {
          name: 'depositPercentage',
          title: 'routes.admin.medical-procedure.deposit-percentage',
          tableItem: {
            width: '100px',
            align: 'center',
            render: (data) => `<span class="font-medium">${data.depositPercentage}</span>`,
          },
        },
        {
          name: 'baseCommissionAmount',
          title: 'routes.admin.medical-procedure.base-commissionAmount',
          tableItem: {
            width: '120px',
            align: 'center',
            render: (data) => data.baseCommissionAmount.toLocaleString(),
          },
        },
        {
          name: 'provinceCommissionAmount',
          title: `HH tại ${this.tenTinh ? this.tenTinh : 'Tỉnh'} (đ)`,
          tableItem: {
            width: '180px',
            align: 'center',
            render: (data) => data.provinceCommissionAmount.toLocaleString(),
          },
        },
        {
          name: '',
          title: 'routes.admin.medical-procedure.action',
          tableItem: {
            width: '85px',
            align: 'center',
            actions: [
              {
                icon: () => 'la-edit',
                text: () => 'routes.admin.medical-procedure.edit',
                color: () => '#40A9FF',
                onClick: (data) => this.router.navigate([this.language + '/medical-procedure/edit', data.id]),
              },
              {
                icon: () => 'la-trash',
                text: () => 'routes.admin.medical-procedure.delete',
                textConfirm: () => 'components.data-table.wanttodeletethisrecord',
                color: () => '#dc2626',
                confirm: true,
                onClick: (data) => this.medicalProcedureFacade.delete(data.id),
              },
            ],
          },
        },
      ];
      this.cdRef.detectChanges();
    });
  }
}
