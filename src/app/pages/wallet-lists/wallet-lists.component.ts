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
import { GlobalFacade, WalletList, WalletListFacade } from '@store';
import { DataTableComponent } from '@core/data-table/data-table.component';
import { Subject, take, takeUntil } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { FormatCurrencyPipe } from '@pipes';

@Component({
  selector: 'app-wallet-list',
  templateUrl: './wallet-lists.component.html',
  providers: [WalletListFacade, FormatCurrencyPipe, GlobalFacade],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WalletListsComponent implements OnInit, OnDestroy {
  listResellerType = {
    0: 'Hệ thống',
    1: 'Farmer',
    2: 'Orderer',
  };

  constructor(
    private route: ActivatedRoute,
    private formatCurrency: FormatCurrencyPipe,
    private globalFacade: GlobalFacade,
    public walletListFacade: WalletListFacade,
    private router: Router,
  ) {}

  @ViewChild('tableWalletList') tableWalletList!: DataTableComponent;
  private destroyed$ = new Subject<void>();
  id = '';

  ngOnInit(): void {
    this.globalFacade.setBreadcrumbs([
      {
        title: 'routes.admin.wallet.electronic_wallet_management',
        link: '/wallet-list',
      },
      {
        title: 'routes.admin.wallet.wallets_list',
        link: '/wallet-list',
      },
    ]);
    this.walletListFacade.id$.pipe(takeUntil(this.destroyed$), take(1)).subscribe((id) => {
      if (!!id) {
        this.id = id;
        this.walletListFacade.setId(null);
      }
    });
    this.walletListFacade.status$.pipe(takeUntil(this.destroyed$)).subscribe((status) => {
      switch (status) {
        case 'putLockOk':
        case 'putUnlockOk':
          this.tableWalletList.changeData();
      }
    });
    this.table();
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  classRow(data: WalletList, { id }: { id: string }) {
    return data.id === id ? 'bg-blue-100' : '';
  }

  filter = '{"type": null,"ownerLevel": null}';

  handleFilter(filter: any): void {
    if (filter) {
      const newFilter = JSON.parse(filter);
      this.tableWalletList.filter(null, null, null, newFilter);
    }
  }

  filterBalanceFrom = '{"BalanceFrom": null}';

  handleFilterBalanceFrom(): void {
    const newFilter = JSON.parse(this.filterBalanceFrom);
    for (const key in newFilter) {
      if (newFilter.hasOwnProperty(key)) {
        this.tableWalletList.filter(key, null, newFilter[key]);
      }
    }
  }

  detailWalletList(id: string) {
    this.router.navigate([id], { relativeTo: this.route });
    if (id !== this.id) this.walletListFacade.getById(id);
  }

  columnsTable: DataTableModel<WalletList>[] = [];
  @ViewChild('ownerFullName') ownerFullName!: TemplateRef<HTMLTemplateElement>;

  private table() {
    setTimeout(() => {
      this.columnsTable = [
        {
          name: 'ownerFullName',
          title: 'routes.admin.wallet.full_name',
          tableItem: {
            renderTemplate: this.ownerFullName,
          },
        },
        {
          name: 'owner',
          title: 'routes.admin.wallet.Username',
          tableItem: {},
        },
        {
          name: 'ownerPhone',
          title: 'routes.admin.wallet.phone_number',
          tableItem: {
            width: '150px',
          },
        },
        {
          name: 'level',
          title: 'routes.admin.wallet.account_type',
          tableItem: {
            width: '150px',
            render: (data) => this.listResellerType[data.ownerLevel as keyof typeof this.listResellerType],
          },
        },
        {
          name: 'balance',
          title: 'routes.admin.wallet.wallet_balance',
          tableItem: {
            width: '150px',
            render: (data) => this.formatCurrency.transform(data.balance, '₫'),
          },
        },
        {
          name: '',
          title: 'routes.admin.wallet.action',
          tableItem: {
            width: '100px',
            align: 'center',
            actions: [
              {
                icon: (data) => (!data.locked ? 'la-lock' : 'la-unlock'),
                text: (data) => 'routes.admin.wallet' + (!data.locked ? '.lock' : '.unlock'),
                color: (data) => (!data.locked ? '#318200' : '#ec3737'),
                onClick: (data) =>
                  !data.locked ? this.walletListFacade.putLock(data.id) : this.walletListFacade.putUnlock(data.id),
                confirm: true,
              },
            ],
          },
        },
      ];
    });
  }
}
