import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';

import { GlobalFacade, WalletSms, WalletSmsFacade } from '@store';
import { DataTableModel } from '@model';

@Component({
  selector: 'app-wallet-sms',
  templateUrl: './wallet-sms.component.html',
  providers: [GlobalFacade, WalletSmsFacade],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WalletSmsComponent implements OnInit {
  constructor(private globalFacade: GlobalFacade, public walletSmsFacade: WalletSmsFacade) {}

  ngOnInit(): void {
    this.globalFacade.setBreadcrumbs([
      {
        title: 'routes.admin.wallet.electronic_wallet_management',
        link: '/wallet-sms',
      },
      {
        title: 'routes.admin.wallet.SMS_balance_notifications',
        link: '/wallet-sms',
      },
    ]);
    this.table();
  }

  columnsTable: DataTableModel<WalletSms>[] = [];

  private table() {
    setTimeout(() => {
      this.columnsTable = [
        {
          name: 'phoneNumber',
          title: 'routes.admin.wallet.phone',
          tableItem: {
            width: '200px',
          },
        },
        {
          name: 'amount',
          title: 'routes.admin.wallet.money_amount',
          tableItem: {
            width: '200px',
          },
        },
        {
          name: 'matched',
          title: 'routes.admin.wallet.order_matching',
          tableItem: {
            width: '200px',
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
