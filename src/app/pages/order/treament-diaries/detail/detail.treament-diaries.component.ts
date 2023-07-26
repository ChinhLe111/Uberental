import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalFacade, OrdersFacade } from '@store';
import * as moment from 'moment';

// @ts-ignore
import GLightbox from 'glightbox';
import { getLanguage } from '@utils';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.treament-diaries.component.html',
  providers: [OrdersFacade],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailTreamentDiariesComponent implements OnInit {
  constructor(
    public OrdersFacade: OrdersFacade,
    protected route: ActivatedRoute,
    protected router: Router,
    public globalFacade: GlobalFacade,
  ) {
    setTimeout(() => GLightbox(), 400);
  }
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
    this.OrdersFacade.getDetailTreamentDiaries(this.route.snapshot.params.idTreament);
  }

  transform(value: any, query = 'HH:mm DD/MM/YYYY'): any {
    return value ? moment(value).format(query) : '';
  }
}
