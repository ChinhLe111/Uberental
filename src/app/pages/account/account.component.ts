import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subject, take, takeUntil } from 'rxjs';
import * as moment from 'moment';

import { DataTableModel, QueryFilter } from '@model';
import { FormatDatePipe } from '@pipes';
import { GlobalFacade, RoleFacade, UserFacade, User } from '@store';
import { getLanguage } from '@utils';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  providers: [UserFacade, FormatDatePipe, RoleFacade],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountComponent implements OnInit, OnDestroy {
  @ViewChild('tableAccount') tableAccount: any;
  @ViewChild('name') name!: TemplateRef<HTMLTemplateElement>;
  @ViewChild('isEmailVerified') isEmailVerified!: TemplateRef<HTMLTemplateElement>;
  columnsTable: DataTableModel<User>[] = [];
  private destroyed$ = new Subject<void>();
  id?: string = '';
  isCustomer!: boolean;
  language = getLanguage();

  constructor(
    protected translate: TranslateService,
    protected route: ActivatedRoute,
    protected router: Router,
    protected userFacade: UserFacade,
    protected formatDate: FormatDatePipe,
    protected globalFacade: GlobalFacade,
    protected roleFacade: RoleFacade,
  ) {}

  ngOnInit(): void {
    if (this.route.snapshot.routeConfig?.path?.slice(0, 8) == 'customer') {
      this.isCustomer = true;
      this.globalFacade.setBreadcrumbs([
        {
          title: 'routes.admin.user.manageAccount',
          link: '/navigation',
        },
        {
          title: 'routes.admin.user.customerAccount',
          link: '/customer-account',
        },
      ]);
      this.roleFacade.rolesCustomer({ page: 1, size: 10 });
    } else {
      this.isCustomer = false;
      this.globalFacade.setBreadcrumbs([
        {
          title: 'routes.admin.user.manageAccount',
          link: '/navigation',
        },
        {
          title: 'routes.admin.user.internalAccount',
          link: '/internal-account',
        },
      ]);
      this.roleFacade.rolesInternal({ page: 1, size: 10 });
    }

    this.userFacade.status$.pipe(takeUntil(this.destroyed$)).subscribe((status) => {
      switch (status) {
        case 'deleteOk':
          this.tableAccount.changeData();
          break;
      }
    });

    this.userFacade.id$.pipe(takeUntil(this.destroyed$), take(1)).subscribe((id) => {
      if (!!id) {
        this.id = id;
        this.userFacade.setId(null);
      }
    });

    setTimeout(() => {
      this.columnsTable = [
        {
          name: 'name',
          title: 'routes.admin.user.userName',
          tableItem: {
            width: '200px',
            renderTemplate: this.name,
          },
        },
        {
          name: 'userName',
          title: 'Email',
          tableItem: {
            width: '200px',
          },
        },
        {
          name: 'role',
          title: 'routes.admin.user.role',
          tableItem: {
            width: '120px',
          },
        },
        {
          name: 'createdOnDate',
          title: 'routes.admin.user.date',
          tableItem: {
            width: '105px',
            render: (item) => this.formatDate.transform(item?.createdOnDate, 'DD/MM/yyyy'),
          },
        },
        {
          name: 'isEmailVerified ',
          title: 'routes.admin.user.status',
          tableItem: this.isCustomer
            ? {
                width: '95px',
                renderTemplate: this.isEmailVerified,
              }
            : undefined,
        },
        {
          name: '',
          title: 'routes.admin.Layout.action',
          tableItem: {
            width: '85px',
            align: 'center',
            actions: [
              {
                icon: () => 'la-key',
                color: () => '#40A9FF',
                text: () => 'routes.admin.user.changePassword',
                onClick: (data) =>
                  this.isCustomer
                    ? this.router.navigate([this.language + '/customer-account', data.id, 'password'])
                    : this.router.navigate([this.language + '/internal-account', data.id, 'password']),
              },
              {
                icon: () => 'la-edit',
                color: () => '#40A9FF',
                text: () => 'routes.admin.Layout.edit',
                onClick: (data) =>
                  this.isCustomer
                    ? this.router.navigate([this.language + '/customer-account', data.id, 'edit'])
                    : this.router.navigate([this.language + '/internal-account', data.id, 'edit']),
              },
              {
                icon: () => 'la-trash',
                color: () => '#dc2626',
                text: () => 'routes.admin.Layout.delete',
                textConfirm: () => 'components.data-table.wanttodeletethisrecord',
                confirm: true,
                onClick: (data) => this.userFacade.delete(data.id || ''),
              },
            ],
          },
        },
      ];
    });
  }

  classRow(data: User, { id }: { id: string }) {
    return data.id === id ? 'bg-blue-100' : '';
  }

  filteDateRange(data: any) {
    const dataS = moment(data[0]).format('YYYY-MM-DD, 00:00:00');
    const dataE = moment(data[1]).format('YYYY-MM-DD, 23:59:59');
    const rs = [dataS, dataE];
    if (data.length == 0) {
      if (data) this.tableAccount.filter('DateRange', null, []);
    } else if (data) this.tableAccount.filter('DateRange', null, rs);
  }

  filterUsers(event: QueryFilter) {
    const filter = {
      ...JSON.parse(event.filter),
      IsEmployee: true,
    };
    const body: QueryFilter = {
      ...event,
      filter: JSON.stringify(filter),
    };
    this.userFacade.getList(body);
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
