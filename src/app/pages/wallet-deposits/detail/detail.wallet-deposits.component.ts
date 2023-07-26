import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';

import { ListColorStatus } from '../model-status';
import { DataTableComponent } from '@core/data-table/data-table.component';
import { DataTableModel, FormModel } from '@model';
import { User, WalletDeposits, WalletDepositsFacade, WalletSms, WalletSmsFacade } from '@store';
import { Subject, takeUntil } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { FormatCurrencyPipe, FormatDatePipe } from '@pipes';

@Component({
  selector: 'app-detail-wallet-deposits',
  templateUrl: './detail.wallet-deposits.component.html',
  styleUrls: ['./detail.wallet-deposits.component.less'],
  providers: [WalletDepositsFacade, WalletSmsFacade, FormatDatePipe, FormatCurrencyPipe],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailWalletDepositsComponent implements OnInit, OnDestroy {
  @Input() user?: User;
  @Input() id?: string;
  @Input() isVisible?: boolean;
  @Output() handleCancel = new EventEmitter();

  protected readonly listColorStatus = ListColorStatus;

  constructor(
    public formatDate: FormatDatePipe,
    public formatCurrency: FormatCurrencyPipe,
    private walletSmsFacade: WalletSmsFacade,
    public walletDepositsFacade: WalletDepositsFacade,
  ) {}

  detail?: WalletDeposits & { messages: WalletSms[] };
  private destroyed$ = new Subject<void>();

  ngOnInit(): void {
    this.walletDepositsFacade.data$.pipe(takeUntil(this.destroyed$)).subscribe({
      next: (res) => {
        if (res) {
          if (this.user?.level && this.user.level > 8) {
            this.walletSmsFacade.get({ filter: JSON.stringify({ fullTextSearch: res?.transferContent }) });
            this.walletSmsFacade.pagination$.pipe(takeUntil(this.destroyed$)).subscribe((data) => {
              this.tableMessages();
              this.detail = { ...res, messages: data.content };
            });
          } else {
            this.tableMessages();
            this.detail = { ...res, messages: [] };
          }
        }
      },
      error: () => this.handleCancelDetail(),
    });
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  handleCancelDetail(): void {
    this.handleCancel.emit();
  }

  isVisibleCancel = false;
  cancelId = '';

  handleOkModal(validateForm: FormGroup): void {
    if (validateForm.status === 'VALID') {
      this.isVisibleCancel = false;
      this.walletDepositsFacade.putCancel(this.cancelId, validateForm.value.cancelReason);
      this.walletDepositsFacade.status$.pipe(takeUntil(this.destroyed$)).subscribe((status) => {
        switch (status) {
          case 'putCancelOk':
            this.handleCancelDetail();
            break;
        }
      });
    }
  }

  handleCancelModal(): void {
    this.isVisibleCancel = false;
  }

  @ViewChild('tableMessage') tableMessage?: DataTableComponent;

  handleStatus(status: string, data: WalletDeposits): void {
    switch (status) {
      case 'CANCEL':
        this.cancelId = data.id;
        this.isVisibleCancel = true;
        break;
      case 'CONFIRM_RECEIVED':
        this.walletDepositsFacade.putConfirmReceived(data.id, []);
        this.handleCancelDetail();
        break;
      case 'CONFIRM_TRANSFERRED':
        this.walletDepositsFacade.putConfirmTransferred(data.id);
        this.handleCancelDetail();
        break;
    }
  }

  columnsCancel: FormModel[] = [
    {
      name: 'cancelReason',
      title: 'routes.admin.wallet.reason_for_cancellation',
      formItem: {
        type: 'textarea',
      },
    },
  ];

  columnsMessages: DataTableModel<any>[] = [];

  private tableMessages() {
    setTimeout(() => {
      this.columnsMessages = [
        {
          name: 'phoneNumber',
          title: 'routes.admin.wallet.phone',
          tableItem: {
            width: '120px',
          },
        },
        {
          name: 'amount',
          title: 'routes.admin.wallet.money_amount',
          tableItem: {
            width: '90px',
          },
        },
        {
          name: 'matched',
          title: 'routes.admin.wallet.order_matching',
          tableItem: {
            width: '80px',
            render: (data) =>
              `<i class="las la-lg la-${
                data.matched ? 'check-circle text-green-600' : 'times-circle text-red-600'
              }"></i>`,
          },
        },
        {
          name: 'content',
          title: 'routes.admin.wallet.content',
          tableItem: {},
        },
      ];
    });
  }
}
