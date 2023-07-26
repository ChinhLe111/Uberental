import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { AddressFacade, Clinics, ClinicsFacade, GlobalFacade, Province } from '@store';
import { DataTableModel } from '@model';
import { Subject, take, takeUntil, withLatestFrom } from 'rxjs';
import { NzMarks, NzSliderValue } from 'ng-zorro-antd/slider/typings';
import { FormatCurrencyPipe } from '@pipes';
import { TranslateService } from '@ngx-translate/core';
import { getLanguage } from '@utils';

@Component({
  selector: 'app-clinics',
  templateUrl: './clinics.component.html',
  providers: [ClinicsFacade, AddressFacade, GlobalFacade, FormatCurrencyPipe],
})
export class ClinicsComponent implements OnInit, OnDestroy {
  listStatus = [
    { label: 'Đã duyệt', status: 'APPROVED' },
    { label: 'Chờ duyệt', status: 'WAIT_FOR_APPROVAL' },
  ];
  selectStatus: any;
  selectProvince!: number;
  language = getLanguage();

  constructor(
    private formatCurrency: FormatCurrencyPipe,
    private globalFacade: GlobalFacade,
    protected clinicsFacade: ClinicsFacade,
    protected router: Router,
    protected route: ActivatedRoute,
    public addressFacade: AddressFacade,
    public translate: TranslateService,
  ) {}

  columnsTable: DataTableModel<Clinics>[] = [];

  private destroyed$ = new Subject<void>();

  marks: NzMarks = {
    0: '0',
    200: '200',
    500: '500',
    1000: '1,000',
  };
  id?: string = '';

  ngOnInit(): void {
    this.globalFacade.setBreadcrumbs([
      {
        title: 'QUẢN LÝ DANH MỤC',
        link: '/clinics',
      },
      {
        title: 'Phòng khám',
        link: '/clinics',
      },
    ]);
    this.addressFacade.getProvinceList({});

    this.clinicsFacade.status$.pipe(takeUntil(this.destroyed$)).subscribe((status) => {
      switch (status) {
        case 'postApproveClinicOk':
          this.tableClinics.changeData();
          break;
      }
    });
    this.clinicsFacade.query$
      .pipe(takeUntil(this.destroyed$), withLatestFrom(this.clinicsFacade.id$), take(1))
      .subscribe(([query, id]) => {
        if (!!id) {
          this.id = id;
          this.clinicsFacade.setId(null);
        }

        if (!!id && !!query) {
          this.router.navigate([], {
            relativeTo: this.route,
            queryParams: query,
            queryParamsHandling: 'merge',
          });
        }
      });
    this.table();
  }

  onAfterChange(value: NzSliderValue) {
    if (value instanceof Array) {
      this.setMarks(value);
      this.tableClinics.filter('MachineSeatsRange', null, value);
    }
  }

  onAfterChangeEmployee(value: NzSliderValue) {
    if (value instanceof Array) {
      this.setMarks(value);
      this.tableClinics.filter('TotalEmployeeRange', null, value);
    }
  }

  classRow(data: Clinics, { id }: { id: string }) {
    // console.log(this.id);
    return data.id === id ? 'bg-blue-100' : '';
  }

  setMarks(value: number[]) {
    const MachineSeatsRange: { [key: number]: string } = {
      0: '0',
      200: '200',
      500: '500',
      1000: '1,000',
    };
    value.map((item: any) => {
      MachineSeatsRange[item] = `${item}`;
    });
    this.marks = MachineSeatsRange;
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  @ViewChild('tableClinics') tableClinics!: any;

  tenTinh?: string;

  filterProvince(maTinh: number, dataProvince: Province[]) {
    this.tenTinh = '';
    this.tableClinics.filter('ProvinceCode', null, maTinh);
    if (maTinh != null) {
      dataProvince.map((province) => {
        if (province.maTinh == maTinh) {
          this.tenTinh = province.tenTinh;
          return;
        }
      });
    }
    this.table();
    // this.tableClinics.filter('ProvinceCode', null, province?.ma);
    // this.addressFacade.getDistrictList({ filter: JSON.stringify({ ParentId: province?.ma }) });
  }

  @ViewChild('clinicName') clinicName!: TemplateRef<HTMLTemplateElement>;
  @ViewChild('infrastructure') infrastructure!: TemplateRef<HTMLTemplateElement>;
  @ViewChild('status') status!: TemplateRef<HTMLTemplateElement>;
  @ViewChild('supervisorName') supervisorName!: TemplateRef<HTMLTemplateElement>;
  @ViewChild('totalOrder') totalOrder!: TemplateRef<HTMLTemplateElement>;

  public table() {
    setTimeout(() => {
      this.columnsTable = [
        {
          name: 'name',
          title: 'routes.admin.clinics.name',
          tableItem: {
            width: '300px',
            renderTemplate: this.clinicName,
          },
        },
        {
          name: 'supervisorName',
          title: 'routes.admin.clinics.inCharge',
          tableItem: {
            width: '160px',
            renderTemplate: this.supervisorName,
          },
        },
        {
          name: ' ',
          title: 'routes.admin.clinics.infrastructure',
          tableItem: {
            width: '105px',
            renderTemplate: this.infrastructure,
          },
        },
        {
          name: 'workingTimeDescription',
          title: 'routes.admin.clinics.openingTimes',
          tableItem: {
            width: '110px',
          },
        },
        {
          name: 'statusCode',
          title: 'routes.admin.clinics.status',
          tableItem: {
            width: '90px',
            align: 'center',
            renderTemplate: this.status,
          },
        },
        {
          name: 'totalOrder',
          title: 'routes.admin.clinics.order',
          tableItem: {
            width: '85px',
            align: 'center',
            renderTemplate: this.totalOrder,
          },
        },
      ];
    });
  }
}
