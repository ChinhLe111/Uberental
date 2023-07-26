import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { ClinicsFacade, GlobalFacade, OrdersFacade, ProfileFarmerFacade, Proposal, TreamentDiaries } from '@store';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { Subject, take, takeUntil } from 'rxjs';
import { DataTableModel, FormModel } from '@model';
import { FormGroup } from '@angular/forms';

// @ts-ignore
import GLightbox from 'glightbox';
import { getLanguage } from '@utils';

@Component({
  selector: 'app-detail.order',
  templateUrl: './detail.order.component.html',
  providers: [OrdersFacade, ProfileFarmerFacade, ClinicsFacade],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailOrderComponent implements OnInit, OnDestroy {
  @ViewChild('tableProposal') tableProposal!: any;
  @ViewChild('tableTreamentDiaries') tableTreamentDiaries!: any;
  @ViewChild('treatmentDate') treatmentDate!: TemplateRef<HTMLTemplateElement>;
  @ViewChild('NumbersOfTeeth') NumbersOfTeeth!: TemplateRef<HTMLTemplateElement>;
  private destroyed$ = new Subject<void>();
  columnsTable: DataTableModel<Proposal>[] = [];
  columnsTableDiaries: DataTableModel<TreamentDiaries>[] = [];
  language = getLanguage();

  constructor(
    protected route: ActivatedRoute,
    protected router: Router,
    public OrdersFacade: OrdersFacade,
    public profileFarmerFacade: ProfileFarmerFacade,
    public clinicsFacade: ClinicsFacade,
    public globalFacade: GlobalFacade,
  ) {
    setTimeout(() => GLightbox(), 400);
  }

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
    // this.OrdersFacade.getListClaims({ id: this.route.snapshot.params.id });
    this.OrdersFacade.getById(this.route.snapshot.params.id);
    this.OrdersFacade.getListProposalById(this.route.snapshot.params.id);
    this.OrdersFacade.data$.pipe(takeUntil(this.destroyed$)).subscribe((data) => {
      if (data?.farmerProfile?.id) {
        this.profileFarmerFacade?.getById(data?.farmerProfile?.id);
      }
      if (data?.clinicId) {
        this.clinicsFacade.getById(data.clinicId);
        setTimeout(() => {
          this.columnsTableDiaries = [
            {
              name: 'treatmentDate',
              title: 'routes.admin.order.Implementation date and time',
              tableItem: {
                align: 'center',
                width: '120px',
                renderTemplate: this.treatmentDate,
              },
            },
            {
              name: 'farmerName',
              title: 'routes.admin.order.Farmer made',
              tableItem: {
                align: 'center',
                render: (data) => `<span class="font-semibold text-blue-800 text-sm">${data?.farmerName}</span>`,
              },
            },
            {
              name: '',
              title: 'routes.admin.order.Number of teeth treated',
              tableItem: {
                align: 'center',
                renderTemplate: this.NumbersOfTeeth,
              },
            },
            {
              name: 'numbersOfTeeth',
              title: 'routes.admin.order.Treatment teeth',
              tableItem: {
                align: 'center',
                render: (data) => `<strong class="text-sm">${data?.numbersOfTeeth}</strong>`,
              },
            },
          ];
        });
      }
    });
    this.OrdersFacade.getListTreamentDiaries(this.route.snapshot.params.id, {
      page: 1,
      size: 5,
      filter: JSON.stringify({}),
      sort: '',
    });

    this.OrdersFacade.status$.pipe(takeUntil(this.destroyed$)).subscribe((data) => {
      if (data == 'postApproveOrder ok' || data == 'postRejectOrder ok' || data == 'error') {
        this.OrdersFacade.getById(this.route.snapshot.params.id);
      }
    });
  }

  handleBack() {
    this.OrdersFacade.setId(this.route.snapshot.params.id);
    this.OrdersFacade.query$.pipe(take(1)).subscribe((query) => {
      console.log(query);
      this.router.navigate([this.language + '/order'], {
        relativeTo: this.route,
        queryParams: query || {},
        queryParamsHandling: 'merge',
      });
    });
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  columnsCancel: FormModel[] = [
    {
      name: 'note',
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
      this.OrdersFacade.postRejectOrder(this.id, validateForm.value.note);
    }
  }

  handleCancelModal() {
    this.isVisibleCancel = false;
  }

  transform(value: any, query = 'HH:mm DD/MM/YYYY'): any {
    return value ? moment(value).format(query) : '';
  }

  transformDayTime(value: any, query = 'DD/MM/YYYY - H:mm'): any {
    return value ? moment(value).format(query) : '';
  }

  transformBirthDay(value: any, query = 'DD/MM/YYYY'): any {
    return value ? moment(value).format(query) : '';
  }

  protected readonly moment = moment;
}
