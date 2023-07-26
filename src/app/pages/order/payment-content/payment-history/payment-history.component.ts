import { ChangeDetectionStrategy, Component, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { GlobalFacade, Orders, OrdersFacade } from '@store';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { DataTableModel } from '@model';
import { getLanguage } from '@utils';

@Component({
  selector: 'app-payment-history',
  templateUrl: './payment-history.component.html',
  providers: [OrdersFacade],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentHistoryComponent implements OnInit {
  columnsTable: DataTableModel<Orders>[] = [];
  @ViewChild('tablePaymentHistory') tablePaymentHistory!: any;
  @ViewChild('paymentDay') paymentDay!: TemplateRef<HTMLTemplateElement>;
  @ViewChild('tableUserName') tableUserName!: TemplateRef<HTMLTemplateElement>;
  @ViewChild('totalReceiveAmount') totalReceiveAmount!: TemplateRef<HTMLTemplateElement>;
  @ViewChild('paymentInstallment') paymentInstallment!: TemplateRef<HTMLTemplateElement>;
  @ViewChild('isPaid') isPaid!: TemplateRef<HTMLTemplateElement>;
  total = this.tablePaymentHistory?.total;
  language = getLanguage();

  constructor(
    protected route: ActivatedRoute,
    protected router: Router,
    public OrdersFacade: OrdersFacade,
    public globalFacade: GlobalFacade,
  ) {}

  ngOnInit() {
    console.log(this.total);
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
    this.OrdersFacade?.getPaymentHistory(this.route.snapshot.params.id, {});
    setTimeout(() => {
      this.columnsTable = [
        {
          name: '',
          title: 'Ngày Thanh toán',
          tableItem: {
            align: 'center',
            width: '135px',
            renderTemplate: this.paymentDay,
          },
        },
        {
          name: 'farmerUserName',
          title: 'Farmer Side nhận',
          tableItem: {
            align: 'center',
            width: '225px',
            renderTemplate: this.tableUserName,
          },
        },
        {
          name: '',
          title: 'Đợt thanh toán',
          tableItem: {
            width: '115px',
            renderTemplate: this.paymentInstallment,
          },
        },
        {
          name: 'totalReceiveAmount',
          title: 'Số tiền',
          tableItem: {
            width: '115px',
            renderTemplate: this.totalReceiveAmount,
          },
        },
        {
          name: 'isPaid',
          title: 'Trạng thái',
          tableItem: {
            renderTemplate: this.isPaid,
          },
        },
      ];
    });
  }

  transform(value: any, query = 'DD/MM/YYYY'): any {
    return value ? moment(value).format(query) : '';
  }
}
