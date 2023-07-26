import { Component, OnInit } from '@angular/core';
import { GlobalFacade } from '@store';
import { ParametersFacade } from '@src/app/store/parameters.store';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  providers: [ParametersFacade, GlobalFacade],
})
export class DashboardComponent implements OnInit {
  constructor(public parametersFacade: ParametersFacade, private globalFacade: GlobalFacade) {}

  ngOnInit(): void {
    this.globalFacade.setBreadcrumbs([
      {
        title: 'DASHBOARD',
        link: '/dashboard',
      },
    ]);
    this.parametersFacade.getElasticSearch();
  }
}
