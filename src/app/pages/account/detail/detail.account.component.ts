import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalFacade, UserFacade } from '@store';
import { getLanguage } from '@utils';
import { Subject, take, takeUntil } from 'rxjs';

@Component({
  selector: 'app-detail-account',
  templateUrl: './detail.account.component.html',
  providers: [UserFacade],
})
export class DetailAccountComponent implements OnInit, OnDestroy {
  isCustomer?: boolean;
  private destroyed$ = new Subject<void>();
  language = getLanguage();

  constructor(
    protected route: ActivatedRoute,
    protected router: Router,
    public userFacade: UserFacade,
    protected globalFacade: GlobalFacade,
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
    }
    this.userFacade.status$.pipe(takeUntil(this.destroyed$)).subscribe((status) => {
      switch (status) {
        case 'putLockOk':
        case 'putUnlockOk':
          this.userFacade.getById(this.route.snapshot.params.id);
          break;
      }
    });
    this.userFacade.getById(this.route.snapshot.params.id);
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  handleBack() {
    this.userFacade.setId(this.route.snapshot.params.id);
    this.userFacade.query$.pipe(takeUntil(this.destroyed$), take(1)).subscribe((query) => {
      this.router.navigate(
        this.isCustomer ? [this.language + '/customer-account'] : [this.language + '/internal-account'],
        !!query
          ? {
              relativeTo: this.route,
              queryParams: query,
              queryParamsHandling: 'merge',
            }
          : {},
      );
    });
  }
}
