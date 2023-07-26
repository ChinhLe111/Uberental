import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';

import { EscrowListFacade, GlobalFacade, ProfileFarmerFacade } from '@store';
import { FormatCurrencyPipe, FormatDatePipe } from '@pipes';
import { ActivatedRoute, Router } from '@angular/router';
import { ListStatusEscrow } from '../status.model';
import { Subject, take, takeUntil } from 'rxjs';
// @ts-ignore
import GLightbox from 'glightbox';
import {getLanguage} from "@utils";

@Component({
  selector: 'app-detail-escrow-list',
  templateUrl: './detail.escrow-list.component.html',
  providers: [GlobalFacade, EscrowListFacade, FormatDatePipe, FormatCurrencyPipe, ProfileFarmerFacade],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailEscrowListComponent implements OnInit, OnDestroy {
  protected readonly listStatus = ListStatusEscrow;
  findStatus = (statusCode?: string) => this.listStatus.find((status) => status.value === statusCode);
  isVisibleReject = false;

  constructor(
    public route: ActivatedRoute,
    private router: Router,
    private formatDate: FormatDatePipe,
    private formatCurrency: FormatCurrencyPipe,
    private globalFacade: GlobalFacade,
    protected escrowListFacade: EscrowListFacade,
    protected profileFarmerFacade: ProfileFarmerFacade,
  ) {}

  private destroyed$ = new Subject<void>();
  language = getLanguage();
  ngOnInit(): void {
    this.globalFacade.setBreadcrumbs([
      {
        title: 'routes.admin.escrow.ESCROW_MANAGEMENT',
        link: '/escrow-list',
      },
      {
        title: 'routes.admin.escrow.detail_escrow',
        link: '/escrow-list',
      },
    ]);
    const { id } = this.route.snapshot.params;
    if (id) {
      this.escrowListFacade.getById(id);
    }
    this.escrowListFacade.status$.pipe(takeUntil(this.destroyed$)).subscribe((status) => {
      switch (status) {
        case 'getByIdOk':
          this.escrowListFacade.data$.pipe(takeUntil(this.destroyed$)).subscribe((data) => {
            if (data?.farmerId && data?.profileTypeCode == 'FARMER_SIDE') {
              this.profileFarmerFacade.getById(data.farmerId);
              setTimeout(() => {
                GLightbox();
              }, 300);
            }
          });
          break;
        case 'rejectOk':
        case 'approveOk':
          this.handleBack();
          break;
      }
    });
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  handleBack() {
    this.escrowListFacade.setId(this.route.snapshot.params.id);
    this.escrowListFacade.query$.pipe(take(1)).subscribe((query) => {
      this.router.navigate([this.language + '/escrow-list'], {
        relativeTo: this.route,
        queryParams: query || {},
        queryParamsHandling: 'merge',
      });
    });
  }
}
