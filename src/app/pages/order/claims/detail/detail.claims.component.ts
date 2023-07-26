import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { GlobalFacade, OrdersFacade } from '@store';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';

// @ts-ignore
import GLightbox from 'glightbox';
import { FormGroup } from '@angular/forms';
import { FormModel } from '@model';
import { Subject, takeUntil } from 'rxjs';
import { getLanguage } from '@utils';
@Component({
  selector: 'app-detail',
  templateUrl: './detail.claims.component.html',
  providers: [OrdersFacade],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailClaimsComponent implements OnInit, OnDestroy {
  constructor(
    public OrdersFacade: OrdersFacade,
    protected route: ActivatedRoute,
    protected router: Router,
    public globalFacade: GlobalFacade,
  ) {
    setTimeout(() => GLightbox(), 400);
  }
  language = getLanguage();
  private destroyed$ = new Subject<void>();

  ngOnInit() {
    this.globalFacade.setBreadcrumbs([
      {
        title: 'routes.admin.order.CATEGORY_MANAGEMENT',
        link: '/order',
      },
      {
        title: 'Order',
        link: '/order',
      },
    ]);
    this.OrdersFacade.getDetailClaims(this.route.snapshot.params.idClaim);
    this.OrdersFacade.status$.pipe(takeUntil(this.destroyed$)).subscribe((data: any) => {
      if (data == 'putApproveClaims ok' || data == 'putRejectClaims ok')
        this.OrdersFacade.getDetailClaims(this.route.snapshot.params.idClaim);
    });
  }
  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
  transform(value: any, query = 'DD/MM/YYYY HH:mm'): any {
    return value ? moment(value).format(query) : '';
  }
  columnsCancel: FormModel[] = [
    {
      name: 'rejectReason',
      title: 'routes.admin.order.Reason for rejection',
      formItem: {
        type: 'textarea',
        rules: [{ type: 'required' }],
      },
    },
  ];
  isVisibleCancel = false;
  id = '';

  handleShowRejectOrder(orderId: string) {
    this.id = orderId;
    this.isVisibleCancel = true;
  }

  handleOkModal(validateForm: FormGroup): any {
    if (validateForm.status === 'VALID') {
      this.isVisibleCancel = false;
      this.OrdersFacade.putRejectClaims(this.id, validateForm.value.rejectReason);
    }
  }
}
