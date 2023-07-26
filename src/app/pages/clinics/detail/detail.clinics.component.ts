import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

// @ts-ignore
import GLightbox from 'glightbox';
import { ClinicsFacade, GlobalFacade } from '@store';
import { getLanguage } from '@utils';

@Component({
  selector: 'app-d-clinic',
  templateUrl: './detail.clinics.component.html',
  providers: [ClinicsFacade],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class DetailClinicComponent implements OnInit {
  constructor(
    protected route: ActivatedRoute,
    protected router: Router,
    public clinicsFacade: ClinicsFacade,
    public globalFacade: GlobalFacade,
  ) {
    setTimeout(() => GLightbox(), 300);
  }
  language = getLanguage();
  ngOnInit() {
    this.globalFacade.setBreadcrumbs([
      {
        title: 'QUẢN LÝ DANH MỤC',
        link: '/clinics',
      },
      {
        title: 'Phòng khám',
        link: '/clinics',
      },
    ]);
    this.clinicsFacade.getById(this.route.snapshot.params.id);
  }

  postApproveClinic(id: string) {
    this.clinicsFacade.postApproveClinic(id);
  }

  handleBack() {
    this.clinicsFacade.setId(this.route.snapshot.params.id);
    this.router.navigate([this.language + '/clinics']);
  }
}
