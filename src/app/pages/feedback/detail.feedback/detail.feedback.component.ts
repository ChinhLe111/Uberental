import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { GlobalFacade, OrdersFacade } from '@store';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';

@Component({
  selector: 'app-detail.feedback',
  templateUrl: './detail.feedback.component.html',
  providers: [OrdersFacade, GlobalFacade],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailFeedbackComponent implements OnInit {
  constructor(
    protected route: ActivatedRoute,
    protected router: Router,
    public OrdersFacade: OrdersFacade,
    public globalFacade: GlobalFacade,
  ) {}

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

  handleBack() {
    this.OrdersFacade.setId(this.route.snapshot.params.id);
    this.router.navigate(['/feedback']);
  }

  transform(value: any, query = 'HH:mm DD/MM/YYYY'): any {
    return value ? moment(value).format(query) : '';
  }
}
