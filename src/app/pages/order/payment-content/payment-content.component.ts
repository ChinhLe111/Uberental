import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalFacade, OrdersFacade } from '@store';
import { getLanguage } from '@utils';
import * as moment from 'moment';

@Component({
  selector: 'app-payment-content',
  templateUrl: './payment-content.component.html',
  providers: [OrdersFacade],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentContentComponent implements OnInit {
  constructor(
    protected route: ActivatedRoute,
    protected router: Router,
    public OrdersFacade: OrdersFacade,
    public globalFacade: GlobalFacade,
  ) {}
  language = getLanguage();

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
    this.OrdersFacade.getById(this.route.snapshot.params.id);
  }

  transform(value: any, query = 'HH:mm - DD/MM/YYYY'): any {
    return value ? moment(value).format(query) : '';
  }
}
