import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { GlobalFacade, OrdersFacade } from '@store';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { getLanguage } from '@utils';

@Component({
  selector: 'app-detail.proposal',
  templateUrl: './detail.proposal.order.component.html',
  providers: [OrdersFacade],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailProposalOrderComponent implements OnInit {
  constructor(public OrdersFacade: OrdersFacade, protected route: ActivatedRoute, public globalFacade: GlobalFacade) {}
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
    this.OrdersFacade.getDetailProposalById(this.route.snapshot.params.id, this.route.snapshot.params.proposalId);
  }

  transform(value: any, query = 'HH:mm - DD/MM/YYYY'): any {
    return value ? moment(value).utc().format(query) : '';
  }
}
