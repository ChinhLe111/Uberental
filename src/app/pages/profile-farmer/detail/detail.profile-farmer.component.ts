import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

// @ts-ignore
import GLightbox from 'glightbox';
import { GlobalFacade, ProfileFarmerFacade, UploadFacade } from '@store';
import { Subject, takeUntil } from 'rxjs';
import { getLanguage } from '@utils';

@Component({
  selector: 'app-detail-profile-farmer',
  templateUrl: './detail.profile-farmer.component.html',
  providers: [ProfileFarmerFacade, UploadFacade, GlobalFacade],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailProfileFarmerComponent implements OnInit, OnDestroy {
  constructor(
    protected route: ActivatedRoute,
    protected router: Router,
    private globalFacade: GlobalFacade,
    public profileFarmerFacade: ProfileFarmerFacade,
    public uploadFacade: UploadFacade,
  ) {
    setTimeout(() => GLightbox(), 300);
  }

  private destroyed$ = new Subject<void>();
  language = getLanguage();

  ngOnInit(): void {
    this.globalFacade.setBreadcrumbs([
      {
        title: 'routes.admin.profile-farmer.CATEGORY_MANAGEMENT',
        link: '/profile-farmer',
      },
      {
        title: 'Profile Farmer',
        link: '/profile-farmer',
      },
    ]);
    this.uploadFacade.getAttachmentTemplates('farmer');
    this.profileFarmerFacade.getById(this.route.snapshot.params.id);
    this.profileFarmerFacade.status$.pipe(takeUntil(this.destroyed$)).subscribe((data) => {
      if (data == 'putApproveProfileOk') {
        //this.profileFarmerFacade?.getById(this.route.snapshot.params.id);
        this.profileFarmerFacade?.get(this.route.snapshot.params.id);
      }
    });
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  handleBack() {
    this.profileFarmerFacade.setId(this.route.snapshot.params.id);
    this.router.navigate([this.language + '/profile-farmer']);
  }
}
