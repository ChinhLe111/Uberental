import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';

import { EscrowWithdrawalListFacade, GlobalFacade, ProfileFarmerFacade } from '@store';
import { FormatCurrencyPipe, FormatDatePipe } from '@pipes';
import { ListStatusEscrowWithdrawal } from '../status.model';
import { Subject, take, takeUntil } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
// @ts-ignore
import GLightbox from 'glightbox';
import {getLanguage} from "@utils";

@Component({
  selector: 'app-detail-escrow-withdrawal-list',
  templateUrl: './detail.escrow-withdrawal-list.component.html',
  providers: [GlobalFacade, EscrowWithdrawalListFacade, FormatDatePipe, FormatCurrencyPipe, ProfileFarmerFacade],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailEscrowWithdrawalListComponent implements OnInit, OnDestroy {
  protected readonly listStatus = ListStatusEscrowWithdrawal;
  findStatus = (statusCode?: string) => this.listStatus.find((status) => status.value === statusCode);
  isVisibleReject = false;

  constructor(
    public route: ActivatedRoute,
    private router: Router,
    private formatDate: FormatDatePipe,
    private formatCurrency: FormatCurrencyPipe,
    private globalFacade: GlobalFacade,
    protected profileFarmerFacade: ProfileFarmerFacade,
    protected escrowWithdrawalListFacade: EscrowWithdrawalListFacade,
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
        title: 'routes.admin.escrow.detail_escrow_withdrawal',
        link: '/escrow-list',
      },
    ]);
    const { id } = this.route.snapshot.params;
    if (id) {
      this.escrowWithdrawalListFacade.getById(id);
    }
    this.escrowWithdrawalListFacade.status$.pipe(takeUntil(this.destroyed$)).subscribe((status) => {
      switch (status) {
        case 'getByIdOk':
          this.escrowWithdrawalListFacade.data$.pipe(takeUntil(this.destroyed$)).subscribe((data) => {
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
    this.escrowWithdrawalListFacade.setId(this.route.snapshot.params.id);
    this.escrowWithdrawalListFacade.query$.pipe(take(1)).subscribe((query) => {
      this.router.navigate([this.language + '/escrow-withdrawal-list'], {
        relativeTo: this.route,
        queryParams: query || {},
        queryParamsHandling: 'merge',
      });
    });
  }
}
