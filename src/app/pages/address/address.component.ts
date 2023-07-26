import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { AddressFacade, addressReducer, GlobalFacade } from '@store';

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  providers: [AddressFacade],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddressComponent implements OnInit, OnDestroy {
  filterTypeTinh: any;
  filterTypeHuyen: any;

  constructor(protected AddressFacade: AddressFacade, public globalFacade: GlobalFacade) {}

  ngOnInit(): void {
    this.globalFacade.setBreadcrumbs([
      {
        title: 'QUẢN LÝ DANH MỤC',
        link: '/address',
      },
      {
        title: 'Địa chỉ',
        link: '/address',
      },
    ]);
    this.AddressFacade.getProvinceList({});
  }

  ngOnDestroy() {
    this.AddressFacade.getDistrictList({ filter: JSON.stringify({ ParentId: 0 }) });
    this.AddressFacade.getCommuneList({ filter: JSON.stringify({ ParentId: 0 }) });
  }

  onSelectType(item: any) {
    this.filterTypeTinh = item.maTinh;
    this.AddressFacade.getDistrictList({ filter: JSON.stringify({ ParentId: item.maTinh }) });
    this.AddressFacade.getCommuneList({ filter: JSON.stringify({ ParentId: 0 }) });
  }

  onSelectTypeWard(item: any) {
    this.filterTypeHuyen = item.districtCode;
    this.AddressFacade.getCommuneList({ filter: JSON.stringify({ ParentId: item.districtCode }) });
  }

  protected readonly addressReducer = addressReducer;
}
