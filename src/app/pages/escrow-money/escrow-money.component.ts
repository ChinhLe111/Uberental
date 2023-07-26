import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';

import { CodeTypesFacade, EscrowMoney, GlobalFacade } from '@store';
import { debounceTime, distinctUntilChanged, Subject, take, takeUntil, throttleTime } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { Message, getLanguage } from '@utils';
import { TranslateService } from '@ngx-translate/core';
import { FormatCurrencyPipe } from '@pipes';
import { QueryFilter } from '@model';

@Component({
  selector: 'app-escrow-money-code-type',
  templateUrl: './escrow-money.component.html',
  styleUrls: ['./escrow-money.component.less'],
  providers: [GlobalFacade, CodeTypesFacade, Message, FormatCurrencyPipe],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EscrowMoneyComponent implements OnInit, OnDestroy {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private message: Message,
    protected formatCurrency: FormatCurrencyPipe,
    private translate: TranslateService,
    private globalFacade: GlobalFacade,
    public codeTypesFacade: CodeTypesFacade,
  ) {}

  private destroyed$ = new Subject<void>();
  escrowMoneyList: EscrowMoney[] = [];
  search?: string;
  query?: QueryFilter;
  language = getLanguage();

  ngOnInit(): void {
    this.globalFacade.setBreadcrumbs([
      {
        title: 'routes.admin.Layout.CATEGORY_MANAGEMENT',
        link: '/code-types',
      },
      {
        title: 'routes.admin.code_types.code_type',
        link: '/code-types',
      },
    ]);

    this.route.queryParams.pipe(takeUntil(this.destroyed$)).subscribe((queryParams) => {
      if (queryParams.filter) {
        this.search = JSON.parse(queryParams.filter).fullTextSearch;
        this.codeTypesFacade.getEscrowMoney({
          page: 1,
          size: 10,
          ...queryParams,
        });
      } else this.codeTypesFacade.getEscrowMoney({ page: 1, size: 10 });
    });
    this.codeTypesFacade.status$.pipe(takeUntil(this.destroyed$)).subscribe((status) => {
      switch (status) {
        case 'putEscrowMoneyOk':
          this.codeTypesFacade.getEscrowMoney({
            ...this.query,
            filter: JSON.stringify({ fullTextSearch: this.search }),
          });
      }
    });
    this.codeTypesFacade.paginationEscrowMoney$.pipe(takeUntil(this.destroyed$)).subscribe((paginationEscrowMoney) => {
      if (paginationEscrowMoney) {
        this.escrowMoneyList = JSON.parse(JSON.stringify(paginationEscrowMoney.content));
      }
    });
    this.searchEscrowMoney();
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  fullTextSearch = new FormControl();

  searchEscrowMoney() {
    this.fullTextSearch.valueChanges
      .pipe(debounceTime(300), throttleTime(300), distinctUntilChanged(), takeUntil(this.destroyed$))
      .subscribe((value) => {
        if (value)
          this.codeTypesFacade.getEscrowMoney({
            page: 1,
            size: 10,
            filter: JSON.stringify({ fullTextSearch: value }),
          });
        else this.codeTypesFacade.getEscrowMoney({ page: 1, size: 10 });
        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: { filter: JSON.stringify({ fullTextSearch: value }) },
          queryParamsHandling: 'merge',
        });
      });
  }

  changEditTemplate = false;

  handleEscrowMoney(index: number, value?: number, keyUp?: boolean) {
    const input = document.getElementById(`${index}`) as HTMLInputElement;
    if (keyUp) {
      if (parseInt(input.value) >= 0) {
        this.codeTypesFacade.putEscrowMoney(this.escrowMoneyList);
        this.changEditTemplate = false;
      }
    } else if (value && value >= 0) {
      this.escrowMoneyList[index].minimumDepositAmount = value;
      input.style.outlineColor = 'blue';
    } else {
      input.style.outlineColor = 'red';
      this.message.error(this.translate.instant('routes.admin.Layout.error_deposit_amount'));
    }
  }

  handleBack() {
    this.codeTypesFacade.setId(this.route.snapshot.params.id);
    this.codeTypesFacade.query$.pipe(take(1)).subscribe((query) => {
      this.router.navigate([this.language + '/code-types'], {
        relativeTo: this.route,
        queryParams: query || {},
        queryParamsHandling: 'merge',
      });
    });
  }
}
