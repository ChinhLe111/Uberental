import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';

import { DataTableModel } from '@model';
import { GlobalFacade, User, WalletDeposits, WalletDepositsFacade } from '@store';
import { DataTableComponent } from '@core/data-table/data-table.component';
import { ListColorStatus } from './model-status';
import { FormatCurrencyPipe, FormatDatePipe } from '@pipes';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-wallet-deposits',
  templateUrl: './wallet-deposits.component.html',
  providers: [WalletDepositsFacade, GlobalFacade, FormatDatePipe, FormatCurrencyPipe],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WalletDepositsComponent implements OnInit, OnDestroy {
  protected readonly listColorStatus = ListColorStatus;
  listStatus = ['WAIT_TRANSFER', 'CANCELED', 'COMPLETED'];

  constructor(
    private formatDate: FormatDatePipe,
    private formatCurrency: FormatCurrencyPipe,
    private globalFacade: GlobalFacade,
    public walletDepositsFacade: WalletDepositsFacade,
  ) {}

  private destroyed$ = new Subject<void>();
  @ViewChild('tableWalletDeposits') tableWalletDeposits!: DataTableComponent;
  user?: User;

  ngOnInit(): void {
    this.globalFacade.setBreadcrumbs([
      {
        title: 'routes.admin.wallet.electronic_wallet_management',
        link: '/wallet-deposits',
      },
      {
        title: 'routes.admin.wallet.deposit_request',
        link: '/wallet-deposits',
      },
    ]);
    this.globalFacade.user$.pipe(takeUntil(this.destroyed$)).subscribe((user) => {
      this.user = user?.userModel;
    });
    this.walletDepositsFacade.status$.pipe(takeUntil(this.destroyed$)).subscribe((status) => {
      switch (status) {
        case 'putConfirmReceivedOk':
        case 'putConfirmTransferredOk':
          this.tableWalletDeposits.changeData();
          break;
      }
    });
    this.table();
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  status = '';

  handleChangeStatus(Status: string): void {
    this.status = Status;
    this.table();
    this.tableWalletDeposits.filter('Status', null, this.status);
  }

  idDeposits?: string;
  isVisibleDetail = false;

  handleShowDetail(data: WalletDeposits) {
    this.walletDepositsFacade.getById(data.id);
    this.isVisibleDetail = true;
  }

  handleUnShowDetail(): void {
    this.isVisibleDetail = false;
  }

  columnsTable: DataTableModel<WalletDeposits>[] = [];
  @ViewChild('statusTable') statusTable!: TemplateRef<HTMLTemplateElement>;

  private table() {
    setTimeout(() => {
      this.columnsTable = [
        {
          name: 'createdOnDate',
          title: 'routes.admin.wallet.creation_date',
          tableItem: {
            width: '150px',
            onClick: (data) => this.handleShowDetail(data),
            render: (data) =>
              `<span class="text-blue-800 hover:text-blue-600 font-medium">${this.formatDate.transform(
                data.createdOnDate,
                'HH:mm:ss DD/MM/YYYY',
              )}</span>`,
          },
        },
        {
          name: 'createdByUser',
          title: 'routes.admin.wallet.full_name_ctv',
          tableItem: {},
        },
        {
          name: 'transferContent',
          title: 'routes.admin.wallet.content',
          tableItem: {},
        },
        {
          name: 'amount',
          title: 'routes.admin.wallet.deposit_amount',
          tableItem: {
            width: '150px',
            render: (data) => this.formatCurrency.transform(data.amount, '₫'),
          },
        },
        {
          name: 'status',
          title: 'routes.admin.wallet.status',
          tableItem: {
            width: '150px',
            renderTemplate: this.statusTable,
          },
        },
        {
          name: 'isTransferConfirmed',
          title: 'routes.admin.wallet.confirmation_CK',
          tableItem: {
            width: '100px',
            render: (data) =>
              data.isTransferConfirmed
                ? '<div class="text-center"><i class="las la-check-circle la-2x text-green-600"></i></div>'
                : '',
          },
        },
      ];
    });
  }
}
