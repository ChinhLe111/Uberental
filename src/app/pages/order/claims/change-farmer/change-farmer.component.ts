import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { GlobalFacade, Orders, OrdersFacade, ProfileFarmerFacade } from '@store';
import { ActivatedRoute, Router } from '@angular/router';
import { FormComponent } from '@core/form/form.component';
import * as moment from 'moment';
import { DataTableModel, FormModel } from '@model';
import { Subject, takeUntil } from 'rxjs';
import { Message, getLanguage } from '@utils';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-change-farmer',
  templateUrl: './change-farmer.component.html',
  providers: [OrdersFacade, ProfileFarmerFacade],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChangeFarmerComponent implements OnInit, OnDestroy {
  constructor(
    public OrdersFacade: OrdersFacade,
    protected route: ActivatedRoute,
    protected router: Router,
    public globalFacade: GlobalFacade,
    public profileFarmerFacade: ProfileFarmerFacade,
    private message: Message,
    private translate: TranslateService,
  ) {}

  @ViewChild('tableFarmers') tableFarmers!: any;
  @ViewChild('form') form!: FormComponent;
  @ViewChild('image') image!: TemplateRef<HTMLTemplateElement>;
  @ViewChild('information') information!: TemplateRef<HTMLTemplateElement>;
  @ViewChild('address') address!: TemplateRef<HTMLTemplateElement>;
  columnsTable: DataTableModel<Orders>[] = [];
  private destroyed$ = new Subject<void>();
  language = getLanguage();

  view = false;
  province: any;
  farmer: any;

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
    this.OrdersFacade.getById(this.route.snapshot.params.id);
    this.profileFarmerFacade.get({ page: 1, size: -1 });
    this.OrdersFacade.data$.pipe(takeUntil(this.destroyed$)).subscribe((data) => {
      if (data) {
        this.province = data?.provinceCode;
        this.table();
      }
    });
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  viewdata(data: any) {
    this.farmer = data.createdByUserId;
    this.profileFarmerFacade.getById(data.id);
  }

  transform(value: any, query = 'HH:mm - DD/MM/YYYY'): any {
    return value ? moment(value).format(query) : '';
  }

  columnsForm: FormModel[] = [
    {
      name: 'implementationDate',
      title: 'Ngày thực hiện',
      formItem: {
        widthTable: '200px',
        type: 'date',
        rules: [{ type: 'required' }],
      },
    },
  ];

  handleSubmit() {
    const { controls: controls, value: value, valid: valid } = this.form.validateForm;
    const { id } = this.route.snapshot.params;
    const payload = {
      farmerSideId: this.farmer,
      ...value,
    };
    const d1 = value.implementationDate.valueOf();
    const d2 = new Date().valueOf();
    if (!valid) {
      this.checkControls([controls]);
      return;
    } else {
      if (d1 < d2) {
        this.message.error(this.translate.instant('Ngày thực hiện không hợp lệ'));
      } else {
        this.OrdersFacade.postTranferFarmer(id, payload);
      }
    }
  }

  checkControls(controlsArray: Record<string, any>[]) {
    for (const controls of controlsArray) {
      for (const control of Object.values(controls)) {
        if (!control.controls) {
          control.markAsTouched();
          control.updateValueAndValidity();
        } else {
          this.checkControls([control.controls]);
        }
      }
    }
  }

  private table() {
    setTimeout(() => {
      this.columnsTable = [
        {
          name: 'avatar',
          title: '',
          tableItem: {
            width: '200px',
            renderTemplate: this.image,
          },
        },
        {
          name: 'information',
          title: '',
          tableItem: {
            width: '300px',
            renderTemplate: this.information,
          },
        },
        {
          name: 'address',
          title: '',
          tableItem: {
            width: '500px',
            renderTemplate: this.address,
          },
        },
      ];
    });
  }
}
