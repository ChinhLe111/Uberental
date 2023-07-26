import { ChangeDetectionStrategy, Component, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { CodeTypesFacade, GlobalFacade, MedicalProcedureFacade, Orders, OrdersFacade } from '@store';
import { ActivatedRoute, Router } from '@angular/router';
import { DataTableModel, FormModel } from '@model';
import * as moment from 'moment';
import { debounceTime, distinctUntilChanged, Subject, take, takeUntil, throttleTime, withLatestFrom } from 'rxjs';
import { FormControl, FormGroup } from '@angular/forms';
import { query } from '@angular/animations';
import { DataTableComponent } from '@core/data-table/data-table.component';
import { getLanguage } from '@utils';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  providers: [OrdersFacade, MedicalProcedureFacade, CodeTypesFacade],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderComponent implements OnInit {
  listStatus = [
    { label: 'routes.admin.order.WAIT_FOR_APPROVAL', status: 'WAIT_FOR_APPROVAL' },
    { label: 'routes.admin.order.APPROVED', status: 'APPROVED' },
    { label: 'routes.admin.order.ASSIGNED', status: 'ASSIGNED' },
    { label: 'routes.admin.order.ACCEPTED', status: 'ACCEPTED' },
    { label: 'routes.admin.order.WAIT_CONFIRM', status: 'WAIT_CONFIRM' },
    { label: 'routes.admin.order.WAIT_PAYMENT', status: 'WAIT_PAYMENT' },
    { label: 'routes.admin.order.COMPLETED', status: 'COMPLETED' },
    { label: 'routes.admin.order.REJECTED', status: 'REJECTED' },
  ];
  @ViewChild('tableOrders') tableOrders!: DataTableComponent;
  @ViewChild('orderNo') orderNo!: TemplateRef<HTMLTemplateElement>;
  @ViewChild('status') status!: TemplateRef<HTMLTemplateElement>;
  @ViewChild('address') address!: TemplateRef<HTMLTemplateElement>;
  @ViewChild('implementationDate') implementationDate!: TemplateRef<HTMLTemplateElement>;
  columnsTable: DataTableModel<Orders>[] = [];
  fitlerStatus = '';
  id?: string = '';
  private destroyed$ = new Subject<void>();
  language = getLanguage();

  constructor(
    protected route: ActivatedRoute,
    protected router: Router,
    public OrdersFacade: OrdersFacade,
    public globalFacade: GlobalFacade,
    public medicalProcedureFacade: MedicalProcedureFacade,
    public codeTypesFacade: CodeTypesFacade,
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
    this.searchPostValueChange();
    this.codeTypesFacade.get({ size: -1, filter: JSON.stringify({ type: 'MEDICAL_PROCEDURE_GROUP' }) });
    this.medicalProcedureFacade.get({ size: -1 });
    this.route.queryParams.subscribe((queryParams) => {
      if (queryParams.filter) {
        this.fitlerStatus = JSON?.parse(queryParams?.filter)?.statusCode;
      }
    });
    this.OrdersFacade.id$.pipe(takeUntil(this.destroyed$), take(1)).subscribe((id) => {
      if (!!id) {
        this.id = id;
        this.OrdersFacade.setId(null);
      }
    });
    this.OrdersFacade.status$
      .pipe(takeUntil(this.destroyed$), withLatestFrom(this.OrdersFacade.id$))
      .subscribe(async (data) => {
        if (
          data[0] == 'postDistributionOrder ok' ||
          data[0] == 'error' ||
          data[0] == 'postApproveOrder ok' ||
          data[0] == 'postRejectOrder ok'
        ) {
          await this.tableOrders?.filter('statusCode', null, '');
        }
      });
    this.table();
  }

  fullTextSearch = new FormControl();

  searchPostValueChange() {
    this.fullTextSearch.valueChanges
      .pipe(debounceTime(300), throttleTime(300), distinctUntilChanged(), takeUntil(this.destroyed$))
      .subscribe((value) => {
        if (value) this.tableOrders.paramTable.filter.fullTextSearch = value;
        else delete this.tableOrders.paramTable.filter.fullTextSearch;
        this.tableOrders.paramTable.page = 1;
        this.tableOrders.updateQueryParams();
      });
  }

  table() {
    setTimeout(() => {
      this.columnsTable = [
        {
          name: 'orderNo',
          title: 'routes.admin.order.Single_code',
          tableItem: {
            width: '120px',
            renderTemplate: this.orderNo,
          },
        },
        {
          name: 'implementationDate',
          title: 'routes.admin.order.Implementation_date',
          tableItem: {
            width: '135px',
            renderTemplate: this.implementationDate,
            // render: (data) => this.transform(data.implementationDate),
          },
        },
        {
          name: 'medicalProcedureGroup',
          title: 'routes.admin.order.procedure_group',
          tableItem: {
            width: '150px',
            align: 'center',
            render: (data) => data?.medicalProcedureGroup?.title,
          },
        },
        {
          name: 'medicalProcedure',
          title: 'routes.admin.order.trick_type',
          tableItem: {
            width: '150px',
            align: 'center',
            render: (data) => data?.medicalProcedure?.name,
          },
        },
        {
          name: '',
          title: 'routes.admin.order.Implementation_address',
          tableItem: {
            align: 'center',
            width: '325px',
            renderTemplate: this.address,
            // render: (data) => `<span>${data?.?.title}</span>`,
          },
        },
        {
          name: 'statusCode',
          title: 'routes.admin.order.Status',
          tableItem: {
            width: '135px',
            align: 'center',
            renderTemplate: this.status,
          },
        },
        {
          name: '',
          title: 'routes.admin.order.action',
          tableItem: {
            align: 'center',
            actions: [
              {
                icon: () => 'la-paper-plane',
                color: () => '#40A9FF',
                text: () => 'routes.admin.order.Single distribution',
                condition: (data) =>
                  data.statusCode == 'APPROVED' && data?.currentUserConnectStatus?.isDistributed == false,
                onClick: (data) => this.distributionOrder(data),
              },
              {
                icon: () => 'la-minus-circle',
                color: () => '#40A9FF',
                text: () => 'routes.admin.order.Reject the application',
                condition: (data) => data.statusCode == 'APPROVED' || data.statusCode == 'WAIT_FOR_APPROVAL',
                onClick: (data) => this.handleShowRejectOrder(data.id),
              },
              {
                icon: () => 'la-check-circle',
                color: () => '#40A9FF',
                text: () => 'routes.admin.order.Approve the application',
                condition: (data) => data.statusCode == 'WAIT_FOR_APPROVAL' || data.statusCode == 'REJECTED',
                onClick: (data) => this.handleApprove(data),
              },
              {
                icon: () => 'la-eye',
                color: () => '#40A9FF',
                text: () => 'routes.admin.order.Application details',
                onClick: (data) => this.router.navigate([this.language + '/order', data.id]),
              },
              {
                icon: () => 'la-file-excel',
                color: () => '#40A9FF',
                condition: (data) => data.statusCode == 'ACCEPTED' && data.currentUserConnectStatus.isClaims == true,
                text: () => 'routes.admin.order.Service error',
                onClick: (data) => this.router.navigate([this.language + '/order', data.id, 'claims']),
              },
              {
                icon: () => 'la-file-invoice-dollar',
                color: () => '#40A9FF',
                condition: (data) =>
                  data.statusCode == 'WAIT_PAYMENT' ||
                  data.statusCode == 'ACCEPTED' ||
                  data.statusCode == 'WAIT_CONFIRM' ||
                  data.statusCode == 'COMPLETED',
                text: () => 'routes.admin.order.Payment content',
                onClick: (data) => this.router.navigate([this.language + '/order', data.id, 'paymentContent']),
              },
              {
                icon: () => 'la-exclamation',
                color: () => '#40A9FF',
                condition: (data) => data.currentUserConnectStatus.isClaims == true,
                text: () => 'Lỗi dịch vụ',
                onClick: (data) => this.router.navigate([this.language + '/order', data.id, 'claims']),
              },
            ],
          },
        },
      ];
    });
  }

  distributionOrder(data: any) {
    this.OrdersFacade.postDistributionOrder(data.id);
  }

  filteDateRange(data: any) {
    // this.tableOrders.filter('DateRange', null, data);
    const dataS = moment(data[0]).format('YYYY-MM-DD, 00:00:00');
    const dataE = moment(data[1]).format('YYYY-MM-DD, 23:59:59');
    const rs = [dataS, dataE];
    if (data.length == 0) {
      if (data) this.tableOrders.filter('DateRange', null, []);
    } else if (data) this.tableOrders.filter('DateRange', null, rs);
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  classRow(data: Orders, { id }: { id: string }) {
    // console.log(this.id);
    return data.id === id ? 'bg-blue-100' : '';
  }

  async tableFilter(data: string) {
    this.fitlerStatus = data;
    await this.tableOrders?.filter('statusCode', null, data);
    return this.tableOrders.total;
  }

  transform(value: any, query = 'DD/MM/YYYY HH:mm'): any {
    return value ? moment(value).format(query) : '';
  }

  isVisibleCancel = false;
  idReject!: string;

  handleOkModal(validateForm: FormGroup): any {
    if (validateForm.status === 'VALID') {
      this.isVisibleCancel = false;
      this.OrdersFacade.postRejectOrder(this.idReject, validateForm.value.note);
    }
  }

  handleShowRejectOrder(orderId: string) {
    this.idReject = orderId;
    this.isVisibleCancel = true;
  }

  handleApprove(data: any) {
    this.OrdersFacade.postApproveOrder(data.id);
  }

  handleCancelModal() {
    this.isVisibleCancel = false;
  }

  columnsCancel: FormModel[] = [
    {
      name: 'note',
      title: 'routes.admin.order.Reason for rejection',
      formItem: {
        type: 'textarea',
        rules: [{ type: 'required' }],
      },
    },
  ];
}
