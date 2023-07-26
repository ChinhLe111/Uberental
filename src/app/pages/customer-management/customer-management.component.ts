import { ChangeDetectionStrategy, Component, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataTableModel, QueryFilter } from '@model';
import { TranslateService } from '@ngx-translate/core';
import { FormatDatePipe } from '@pipes';
import { Customer, CustomerFacade, GlobalFacade } from '@store';
import moment from 'moment';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-customer-management',
  templateUrl: './customer-management.component.html',
  providers: [CustomerFacade, FormatDatePipe],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomerManagementComponent implements OnInit {
  @ViewChild('tableCustomer') tableCustomer: any;
  @ViewChild('name') name!: TemplateRef<HTMLTemplateElement>;
  columnsTable: DataTableModel<Customer>[] = [];
  id?: string = '';
  private destroyed$ = new Subject<void>();

  constructor(
    protected translate: TranslateService,
    protected route: ActivatedRoute,
    protected router: Router,
    protected customerFacade: CustomerFacade,
    protected formatDate: FormatDatePipe,
    protected globalFacade: GlobalFacade,
  ) {}

  ngOnInit() {
    this.globalFacade.setBreadcrumbs([
      {
        title: 'QUẢN LÝ DANH MỤC',
        link: '/navigation',
      },
      {
        title: 'routes.admin.user.customerManagement',
        link: '/customer-management',
      },
    ]);

    this.customerFacade.status$.pipe(takeUntil(this.destroyed$)).subscribe((status) => {
      switch (status) {
        case 'deleteOk':
          this.tableCustomer.changeData();
          break;
      }
    });
    this.customerFacade.getList({ page: 1, size: 10 });

    setTimeout(() => {
      this.columnsTable = [
        {
          name: 'customerName',
          title: 'routes.admin.user.customerName',
          tableItem: {
            width: '200px',
            renderTemplate: this.name,
          },
        },
        {
          name: 'birthday',
          title: 'routes.admin.user.birthdate',
          tableItem: {
            width: '200px',
            render: (item) => this.formatDate.transform(item?.birthday, 'DD/MM/yyyy'),
          },
        },
        {
          name: 'gender',
          title: 'routes.admin.user.gender',
          tableItem: {
            width: '120px',
          },
        },
        {
          name: 'createdOnDate',
          title: 'routes.admin.user.dateOfFiling',
          tableItem: {
            width: '105px',
            render: (item) => this.formatDate.transform(item?.createdOnDate, 'DD/MM/yyyy'),
          },
        },
        {
          name: '',
          title: 'Trạng thái',
          tableItem: {
            width: '105px',
          },
        },
        {
          name: '',
          title: 'routes.admin.Layout.action',
          tableItem: {
            width: '85px',
            align: 'center',
            actions: [
              {
                icon: () => 'la-edit',
                color: () => '#40A9FF',
                text: () => 'routes.admin.Layout.edit',
                onClick: (data) => this.router.navigate(['customer-account', data.id, 'edit']),
              },
              {
                icon: () => 'la-trash',
                color: () => '#dc2626',
                text: () => 'routes.admin.Layout.delete',
                textConfirm: () => 'components.data-table.wanttodeletethisrecord',
                confirm: true,
                onClick: (data) => this.customerFacade.delete(data.id || ''),
              },
            ],
          },
        },
      ];
    });
  }

  classRow(data: Customer, { id }: { id: string }) {
    return data.id === id ? 'bg-blue-100' : '';
  }

  filteDateRange(data: any) {
    const dataS = moment(data[0]).format('YYYY-MM-DD, 00:00:00');
    const dataE = moment(data[1]).format('YYYY-MM-DD, 23:59:59');
    const rs = [dataS, dataE];
    if (data.length == 0) {
      if (data) this.tableCustomer.filter('DateRange', null, []);
    } else if (data) this.tableCustomer.filter('DateRange', null, rs);
  }

  filterUsers(event: QueryFilter) {
    const filter = {
      ...JSON.parse(event.filter),
    };
    const body: QueryFilter = {
      ...event,
      filter: JSON.stringify(filter),
    };
    this.customerFacade.getList(body);
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
