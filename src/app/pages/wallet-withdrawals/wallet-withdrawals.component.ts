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

import { DataTableModel } from '@model';
import { ListColorStatus } from '@src/app/pages/wallet-deposits/model-status';
import { FormatCurrencyPipe, FormatDatePipe } from '@pipes';
import { DataTableComponent } from '@core/data-table/data-table.component';
import { GlobalFacade, User, WalletWithDrawals, WalletWithDrawalsFacade } from '@store';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-wallet-withdrawals',
  templateUrl: './wallet-withdrawals.component.html',
  providers: [FormatDatePipe, FormatCurrencyPipe, GlobalFacade, WalletWithDrawalsFacade],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WalletWithdrawalsComponent implements OnInit, OnDestroy {
  protected readonly listColorStatus = ListColorStatus;
  listStatus = ['WAIT_CONFIRM', 'CANCELED', 'COMPLETED'];

  constructor(
    private cdr: ChangeDetectorRef,
    private formatDate: FormatDatePipe,
    private formatCurrency: FormatCurrencyPipe,
    private globalFacade: GlobalFacade,
    public walletWithDrawalsFacade: WalletWithDrawalsFacade,
  ) {}

  private destroyed$ = new Subject<void>();
  @ViewChild('tableWalletWithDrawals') tableWalletWithDrawals!: DataTableComponent;
  user?: User;

  ngOnInit(): void {
    this.globalFacade.setBreadcrumbs([
      {
        title: 'routes.admin.wallet.electronic_wallet_management',
        link: '/wallet-withdrawals',
      },
      {
        title: 'routes.admin.wallet.withdrawal_request',
        link: '/wallet-withdrawals',
      },
    ]);
    this.globalFacade.user$.pipe(takeUntil(this.destroyed$)).subscribe((user) => {
      this.user = user?.userModel;
    });
    this.walletWithDrawalsFacade.status$.pipe(takeUntil(this.destroyed$)).subscribe((status) => {
      switch (status) {
        case 'putCompleteOk':
        case 'putConfirmTransferredOk':
          this.tableWalletWithDrawals.changeData();
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

  handleChangeStatus(status: string): void {
    this.status = status;
    this.tableWalletWithDrawals.filter('Status', null, this.status);
    this.table();
  }

  withdrawalsId = '';
  isVisibleDetail = false;

  handleShowDetail(data: WalletWithDrawals): void {
    this.withdrawalsId = data.id;
    // this.walletWithDrawalsFacade.getAttachmentsTemplate(data.id);
    this.walletWithDrawalsFacade.getById(data.id);
    this.isVisibleDetail = true;
  }

  handleUnShowDetail(): void {
    this.isVisibleDetail = false;
  }

  columnsTable: DataTableModel<WalletWithDrawals>[] = [];
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
          title: 'routes.admin.wallet.withdrawal_amount',
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
