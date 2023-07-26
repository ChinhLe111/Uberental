import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-detail-medical-procedure',
  templateUrl: './detail.medical-procedure.component.html',
  providers: [],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailMedicalProcedureComponent {
  constructor(protected route: ActivatedRoute, protected router: Router) {}
}
