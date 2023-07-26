import { ChangeDetectionStrategy, Component, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { CodeTypesFacade, GlobalFacade, Orders, OrdersFacade } from '@store';
import { Router } from '@angular/router';
import { DataTableModel } from '@model';
import * as moment from 'moment';
import { Subject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { getLanguage } from '@utils';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  providers: [OrdersFacade, CodeTypesFacade],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeedbackComponent implements OnInit {
  @ViewChild('implementationDate') implementationDate!: TemplateRef<HTMLTemplateElement>;
  @ViewChild('address') address!: TemplateRef<HTMLTemplateElement>;
  @ViewChild('finishDay') finishDay!: TemplateRef<HTMLTemplateElement>;
  @ViewChild('orderNo') orderNo!: TemplateRef<HTMLTemplateElement>;

  columnsTable: DataTableModel<Orders>[] = [];
  language = getLanguage();
  fitlerStatus = '';
  selectStart: any;
  selectFeedBackType: any;
  id?: string = '';
  private destroyed$ = new Subject<void>();

  @ViewChild('tableOrders') tableOrders!: any;

  constructor(
    protected router: Router,
    public OrdersFacade: OrdersFacade,
    public globalFacade: GlobalFacade,
    public translate: TranslateService,
  ) {}

  ngOnInit() {
    this.globalFacade.setBreadcrumbs([
      {
        title: 'routes.admin.feedback.feedback-management',
        link: '/order',
      },
      {
        title: 'routes.admin.feedback.feedback-list',
        link: '/order',
      },
    ]);
    this.OrdersFacade.getFeedBack({});
    this.table();
  }

  table() {
    setTimeout(() => {
      this.columnsTable = [
        {
          name: 'orderNo',
          title: 'routes.admin.feedback.orderno',
          tableItem: {
            width: '120px',
            renderTemplate: this.orderNo,
          },
        },
        {
          name: 'routes.admin.feedback.implementationdate',
          title: 'Ngày thực hiện',
          tableItem: {
            renderTemplate: this.implementationDate,
          },
        },
        {
          name: 'medicalProcedureGroup',
          title: 'routes.admin.feedback.medicalproceduregroup',
          tableItem: {
            width: '180px',
            align: 'center',
            render: (data) => data?.medicalProcedureGroup?.title,
          },
        },
        {
          name: 'medicalProcedure',
          title: 'routes.admin.feedback.medicalprocedure',
          tableItem: {
            width: '150px',
            align: 'center',
            render: (data) => data?.medicalProcedure?.name,
          },
        },
        {
          name: '',
          title: 'routes.admin.feedback.difficult',
          tableItem: {
            render: (data) => data?.medicalRecord?.difficulty?.title,
          },
        },
        {
          name: '',
          title: 'routes.admin.feedback.implementationaddress',
          tableItem: {
            width: '325px',
            renderTemplate: this.address,
          },
        },
        {
          name: 'statusCode',
          title: 'routes.admin.feedback.completeddate',
          tableItem: {
            width: '135px',
            align: 'center',
            renderTemplate: this.finishDay,
          },
        },
        {
          name: '',
          title: 'routes.admin.order.action',
          tableItem: {
            align: 'center',
            actions: [
              {
                icon: () => 'las la-hospital-alt',
                color: () => '#40A9FF',
                text: () => 'routes.admin.feedback.clinic',
                onClick: (data) => this.router.navigate([this.language + '/feedback', data.id, 'feedback-clinic']),
              },
              {
                icon: () => 'las la-user-nurse',
                color: () => '#40A9FF',
                text: () => 'routes.admin.feedback.farmer',
                onClick: (data) => this.router.navigate([this.language + '/feedback', data.id, 'feedback-farmer']),
              },
            ],
          },
        },
      ];
    });
  }

  classRow(data: Orders, { id }: { id: string }) {
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

  transformTimeDay(value: any, query = 'HH:mm DD/MM/YYYY'): any {
    return value ? moment(value).format(query) : '';
  }
}
