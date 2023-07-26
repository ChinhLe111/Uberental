import {
  AfterViewInit,
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

import { DataTableModel } from '@model';
import { GlobalFacade, MedicalProcedureFacade, ProfileFarmer, ProfileFarmerFacade } from '@store';
import { getLanguage } from '@utils';
import { Subject, take, takeUntil, withLatestFrom } from 'rxjs';

@Component({
  selector: 'app-profile-farmer',
  templateUrl: './profile-farmer.component.html',
  styleUrls: ['./profile-farmer.component.less'],
  providers: [ProfileFarmerFacade, MedicalProcedureFacade, GlobalFacade],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileFarmerComponent implements OnInit, AfterViewInit, OnDestroy {
  listStatus = [
    { label: 'Đã duyệt', status: 'APPROVED' },
    { label: 'Chờ duyệt', status: 'WAIT_FOR_APPROVAL' },
  ];

  constructor(
    protected router: Router,
    private route: ActivatedRoute,
    private cdRef: ChangeDetectorRef,
    private globalFacade: GlobalFacade,
    public profileFarmerFacade: ProfileFarmerFacade,
    public medicalProcedureFacade: MedicalProcedureFacade,
  ) {}

  @ViewChild('tableProfileFarmer') tableProfileFarmer!: any;
  private destroyed$ = new Subject<void>();
  id?: string = '';
  language = getLanguage();

  ngOnInit(): void {
    this.globalFacade.setBreadcrumbs([
      {
        title: 'routes.admin.profile-farmer.CATEGORY_MANAGEMENT',
        link: '/profile-farmer',
      },
      {
        title: 'Profile Farmer',
        link: '/profile-farmer',
      },
    ]);
    this.medicalProcedureFacade.get({ page: 1, size: -1 });
    this.profileFarmerFacade.status$.pipe(takeUntil(this.destroyed$)).subscribe((status) => {
      switch (status) {
        case 'deleteOk':
          this.tableProfileFarmer.changeData();
          break;
      }
    });
    this.profileFarmerFacade.query$
      .pipe(takeUntil(this.destroyed$), withLatestFrom(this.profileFarmerFacade.id$), take(1))
      .subscribe(([query, id]) => {
        if (!!id) {
          this.id = id;
          this.profileFarmerFacade.setId(null);
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

  classRow(data: ProfileFarmer, { id }: { id: string }) {
    return data.id === id ? 'bg-blue-100' : '';
  }

  ngAfterViewInit(): void {
    this.cdRef.detectChanges();
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  columnsTable: DataTableModel<ProfileFarmer>[] = [];
  @ViewChild('farmerName') farmerName!: TemplateRef<HTMLTemplateElement>;
  @ViewChild('userName') userName!: TemplateRef<HTMLTemplateElement>;
  @ViewChild('status') status!: TemplateRef<HTMLTemplateElement>;

  private table() {
    setTimeout(() => {
      this.columnsTable = [
        {
          name: 'name',
          title: 'routes.admin.profile-farmer.farmer-name',
          tableItem: {
            renderTemplate: this.farmerName,
          },
        },
        {
          name: 'createdByUserName',
          title: 'routes.admin.profile-farmer.user-name',
          tableItem: {
            renderTemplate: this.userName,
          },
        },
        {
          name: 'medicalDegree',
          title: 'routes.admin.profile-farmer.medical-degree',
          tableItem: {
            width: '150px',
            render: (data) => `<span class="font-medium">${data?.medicalDegree?.title}</span>`,
          },
        },
        {
          name: 'medicalProcedureListCode',
          title: 'routes.admin.profile-farmer.medical-procedure',
          tableItem: {
            width: '100px',
            align: 'center',
            render: (data) =>
              data?.medicalProcedureListCode.length != 0
                ? `<span class="font-medium">${data?.medicalProcedureListCode.length}</span>`
                : `<span class="font-medium text-gray-400">${data?.medicalProcedureListCode.length}</span>`,
          },
        },
        {
          name: 'totalOrderReceivedCount',
          title: 'routes.admin.profile-farmer.order-received',
          tableItem: {
            width: '100px',
            align: 'center',
            render: (data) =>
              data?.totalOrderReceivedCount != 0
                ? `<span class="font-medium">${data?.totalOrderReceivedCount}</span>`
                : `<span class="font-medium text-gray-400">${data?.totalOrderReceivedCount}</span>`,
          },
        },
        {
          name: 'totalOrderCompletedCount',
          title: 'routes.admin.profile-farmer.order-completed',
          tableItem: {
            width: '100px',
            align: 'center',
            render: (data) =>
              data?.totalOrderCompletedCount != 0
                ? `<span class="font-medium">${data?.totalOrderCompletedCount}</span>`
                : `<span class="font-medium text-gray-400">${data?.totalOrderCompletedCount}</span>`,
          },
        },
        {
          name: 'depositPercentage',
          title: 'routes.admin.profile-farmer.status',
          tableItem: {
            width: '120px',
            align: 'center',
            renderTemplate: this.status,
          },
        },
        {
          name: '',
          title: 'routes.admin.profile-farmer.action',
          tableItem: {
            width: '85px',
            align: 'center',
            actions: [
              {
                icon: () => 'la-edit',
                text: () => 'routes.admin.profile-farmer.edit',
                color: () => '#40A9FF',
                onClick: (data) => this.router.navigate([this.language + '/profile-farmer', data.id, 'edit']),
              },
              {
                icon: () => 'la-trash',
                text: () => 'routes.admin.profile-farmer.delete',
                textConfirm: () => 'components.data-table.wanttodeletethisrecord',
                color: () => '#dc2626',
                confirm: true,
                onClick: (data) => this.profileFarmerFacade.delete(data.id),
              },
            ],
          },
        },
      ];
    });
  }
}
