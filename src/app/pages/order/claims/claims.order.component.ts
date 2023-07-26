import { ChangeDetectorRef, Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Claims, GlobalFacade, OrdersFacade } from '@store';
import { DataTableModel, FormModel } from '@model';
import { Subject, takeUntil } from 'rxjs';
import { DataTableComponent } from '@core/data-table/data-table.component';
import { FormatDatePipe } from '@pipes';
import { FormGroup } from '@angular/forms';
import { getLanguage } from '@utils';

@Component({
  selector: 'app-claims',
  templateUrl: './claims.order.component.html',
  styleUrls: ['./claims.less'],
  providers: [OrdersFacade, FormatDatePipe, GlobalFacade],
})
export class ClaimsOrderComponent implements OnInit, OnDestroy {
  listStatus = [
    { label: 'routes.admin.order.Not fixed the error', status: 'APPROVE' },
    { label: 'routes.admin.order.Fixed the error', status: 'CLOSED' },
    { label: 'routes.admin.order.WAIT_FOR_APPROVAL', status: 'WAIT_FOR_APPROVAL' },
    { label: 'routes.admin.order.REJECTED', status: 'REJECTED' },
  ];
  @ViewChild('tableClaims') tableClaims!: DataTableComponent;
  @ViewChild('feedbackOnDate') feedbackOnDate!: TemplateRef<HTMLTemplateElement>;
  @ViewChild('farmerUserName') farmerUserName!: TemplateRef<HTMLTemplateElement>;
  @ViewChild('status') status!: TemplateRef<HTMLTemplateElement>;
  @ViewChild('claimDescription') claimDescription!: TemplateRef<HTMLTemplateElement>;
  columnsTable: DataTableModel<Claims>[] = [];
  private destroyed$ = new Subject<void>();
  language = getLanguage();

  constructor(
    protected formatDate: FormatDatePipe,
    private cdr: ChangeDetectorRef,
    public ordersFacade: OrdersFacade,
    protected route: ActivatedRoute,
    protected router: Router,
    public globalFacade: GlobalFacade,
  ) {}

  ngOnInit() {
    this.globalFacade.setBreadcrumbs([
      {
        title: 'routes.admin.order.CATEGORY_MANAGEMENT',
        link: '/order',
      },
      {
        title: 'Order',
        link: '/order',
      },
    ]);
    setTimeout(() => {
      this.columnsTable = [
        {
          name: 'feedbackOnDate',
          title: 'Ngày giờ lỗi',
          tableItem: {
            width: '135px',
            renderTemplate: this.feedbackOnDate,
          },
        },
        {
          name: 'farmerName',
          title: 'routes.admin.order.Farmer made',
          tableItem: {
            width: '180px',
            renderTemplate: this.farmerUserName,
          },
        },
        {
          name: 'claimDescription',
          title: 'routes.admin.order.Reason',
          tableItem: {
            renderTemplate: this.claimDescription,
          },
        },
        {
          name: '',
          title: 'routes.admin.order.Status',
          tableItem: {
            width: '180px',
            align: 'center',
            renderTemplate: this.status,
          },
        },
        {
          name: '',
          title: 'routes.admin.order.action',
          tableItem: {
            width: '85px',
            align: 'center',
            actions: [
              {
                icon: () => 'la-check-circle',
                color: () => '#40A9FF',
                text: () => 'Duyệt',
                condition: (data) => data.statusCode == 'WAIT_FOR_APPROVAL',
                onClick: (data) => this.ordersFacade.putApproveClaims(data.id),
              },
              {
                icon: () => 'la-minus-circle',
                color: () => '#40A9FF',
                text: () => 'Từ chối',
                condition: (data) => data.statusCode == 'WAIT_FOR_APPROVAL',
                onClick: (data) => this.handleShowRejectOrder(data.id),
              },
            ],
          },
        },
      ];
      this.cdr.detectChanges();
    });
    this.ordersFacade.status$.pipe(takeUntil(this.destroyed$)).subscribe((data: any) => {
      if (data == 'putApproveClaims ok' || data == 'putRejectClaims ok')
        this.ordersFacade.getListClaims(this.route.snapshot.params.id, {});
    });
  }
  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
  isVisibleCancel = false;
  id = '';

  handleShowRejectOrder(orderId: string) {
    this.id = orderId;
    this.isVisibleCancel = true;
  }

  handleOkModal(validateForm: FormGroup): any {
    if (validateForm.status === 'VALID') {
      this.isVisibleCancel = false;
      this.ordersFacade.putRejectClaims(this.id, validateForm.value.rejectReason);
    }
  }
  columnsCancel: FormModel[] = [
    {
      name: 'rejectReason',
      title: 'routes.admin.order.Reason for rejection',
      formItem: {
        type: 'textarea',
        rules: [{ type: 'required' }],
      },
    },
  ];
}
