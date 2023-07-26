import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, Subject, takeUntil, throttleTime } from 'rxjs';

import { GlobalFacade, MedicalProcedureFacade, ProvinceCommission } from '@store';
import { FormControl } from '@angular/forms';
import { Message, getLanguage } from '@utils';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-province-commission',
  templateUrl: './province-commission.component.html',
  styleUrls: ['./province-commission.component.less'],
  providers: [MedicalProcedureFacade, GlobalFacade, Message],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditProvinceCommissionComponent implements OnInit, OnDestroy {
  protected readonly Array = Array;
  protected readonly Math = Math;

  constructor(
    protected route: ActivatedRoute,
    protected router: Router,
    private message: Message,
    private translate: TranslateService,
    private globalFacade: GlobalFacade,
    public medicalProcedureFacade: MedicalProcedureFacade,
  ) {}

  private destroyed$ = new Subject<void>();
  commissionList: ProvinceCommission[] = [];
  search?: string;
  language = getLanguage();

  ngOnInit() {
    this.globalFacade.setBreadcrumbs([
      {
        title: 'routes.admin.medical-procedure.CATEGORY_MANAGEMENT',
        link: '/medical-procedure',
      },
      {
        title: 'routes.admin.medical-procedure.configure_commission_rates',
        link: '/medical-procedure',
      },
    ]);
    this.route.queryParams.pipe(takeUntil(this.destroyed$)).subscribe((queryParams) => {
      if (queryParams.filter) {
        this.search = JSON.parse(queryParams.filter).fullTextSearch;
        this.medicalProcedureFacade.getCommission(queryParams);
      } else this.medicalProcedureFacade.getCommission({});
    });
    this.medicalProcedureFacade.status$.pipe(takeUntil(this.destroyed$)).subscribe((status) => {
      switch (status) {
        case 'putCommissionOk':
          this.medicalProcedureFacade.getCommission({ filter: JSON.stringify({ fullTextSearch: this.search }) });
      }
    });
    this.medicalProcedureFacade.commissionList$.pipe(takeUntil(this.destroyed$)).subscribe((commissionList) => {
      this.commissionList = JSON.parse(JSON.stringify(commissionList));
    });
    this.searchProvince();
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  fullTextSearch = new FormControl();

  searchProvince() {
    this.fullTextSearch.valueChanges
      .pipe(debounceTime(300), throttleTime(300), distinctUntilChanged(), takeUntil(this.destroyed$))
      .subscribe((value) => {
        if (value) this.medicalProcedureFacade.getCommission({ filter: JSON.stringify({ fullTextSearch: value }) });
        else this.medicalProcedureFacade.getCommission({});
        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: { filter: JSON.stringify({ fullTextSearch: value }) },
          queryParamsHandling: 'merge',
        });
      });
  }

  changEditTemplate = false;

  handleCommission(index: number, value?: number, keyUp?: boolean) {
    const input = document.getElementById(`${index}`) as HTMLInputElement;
    if (keyUp) {
      if (parseInt(input.value) >= 0 && parseInt(input.value) <= 1000) {
        this.medicalProcedureFacade.putCommission(this.commissionList);
        this.changEditTemplate = false;
      }
    } else if (value && value >= 0 && value <= 1000) {
      this.commissionList[index].commissionPercentage = value;
      input.style.outlineColor = 'blue';
    } else {
      input.style.outlineColor = 'red';
      this.message.error(this.translate.instant('routes.admin.medical-procedure.error_commission'));
    }
  }
}
