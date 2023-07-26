import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { GlobalFacade, OrdersFacade } from '@store';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { TranslateService } from '@ngx-translate/core';
import { getLanguage } from '@utils';

// @ts-ignore
import GLightbox from 'glightbox';

@Component({
  selector: 'app-clinic.feedback',
  templateUrl: './clinic.feedback.component.html',
  providers: [OrdersFacade, GlobalFacade],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClinicFeedbackComponent implements OnInit {
  constructor(
    protected route: ActivatedRoute,
    protected router: Router,
    public OrdersFacade: OrdersFacade,
    public globalFacade: GlobalFacade,
    public translate: TranslateService,
  ) {}

  language = getLanguage();

  ngOnInit() {
    this.globalFacade.setBreadcrumbs([
      {
        title: 'routes.admin.order.CATEGORY_MANAGEMENT',
        link: '/feedback',
      },
      {
        title: 'FeedBack',
        link: '/feedback',
      },
    ]);
    this.OrdersFacade.getFeedBackClinic(this.route.snapshot.params.id);
    this.OrdersFacade.getById(this.route.snapshot.params.id);
    setTimeout(() => {
      GLightbox();
    }, 300);
  }

  handleBack() {
    this.OrdersFacade.setId(this.route.snapshot.params.id);
    this.router.navigate([this.language + '/feedback']);
  }

  feedbacktime(value: any): any {
    return moment(value).lang('vi').startOf('day').fromNow();
  }

  transform(value: any, query = 'HH:mm DD/MM/YYYY'): any {
    return value ? moment(value).format(query) : '';
  }
}
