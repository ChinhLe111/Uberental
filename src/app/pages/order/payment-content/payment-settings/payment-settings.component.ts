import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { GlobalFacade, OrdersFacade } from '@store';
import { ActivatedRoute, Router } from '@angular/router';
import { FormModel } from '@model';
import { FormComponent } from '@core/form/form.component';
import * as moment from 'moment';
import { Subject, takeUntil } from 'rxjs';
import { Message, getLanguage } from '@utils';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-payment-settings',
  templateUrl: './payment-settings.component.html',
  providers: [OrdersFacade],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentSettingsComponent implements OnInit, OnDestroy {
  @ViewChild('form') form!: FormComponent;
  private destroyed$ = new Subject<void>();
  constructor(
    public OrdersFacade: OrdersFacade,
    protected route: ActivatedRoute,
    protected router: Router,
    public globalFacade: GlobalFacade,
    private message: Message,
    private translate: TranslateService,
  ) {}
  language = getLanguage();

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
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
    this.OrdersFacade.getById(this.route.snapshot.params.id);
    this.OrdersFacade.data$.pipe(takeUntil(this.destroyed$)).subscribe((data) => {
      if (data?.orderDepositAmount) {
        localStorage.setItem('value', data?.orderDepositAmount.toString());
      }
    });
    this.formsetting();
  }

  columnsForm: FormModel[] = [];

  formsetting() {
    this.columnsForm = [
      {
        name: 'paymentStartDate',
        title: 'Ngày bắt đầu',
        formItem: {
          col: 6,
          type: 'date',
          rules: [{ type: 'required' }],
          render: this.form?.values?.paymentSetting?.firstPaymentAmount,
        },
      },
      {
        name: 'firstPaymentAmount',
        title: 'Tiền thanh toán lần đầu',
        formItem: {
          col: 6,
          type: 'number',
          rules: [
            { type: 'required' },
            { type: 'min', value: 1 },
            { type: 'max', value: Number(localStorage.getItem('value')) },
          ],
        },
      },
      {
        name: 'repeatCount',
        title: 'Lặp lại sau',
        formItem: {
          type: 'number',
          col: 6,
          rules: [{ type: 'required' }, { type: 'min', value: 1 }],
        },
      },
      {
        name: 'unitTime',
        title: 'Đơn vị thời gian lặp lại',
        formItem: {
          type: 'select',
          col: 6,
          rules: [{ type: 'required' }],
          list: [
            { label: 'Ngày', value: 'DAY' },
            { label: 'Tháng', value: 'MONTH' },
          ],
        },
      },
      {
        name: 'paymentAmount',
        title: 'Số tiền mỗi đợt',
        formItem: {
          type: 'number',
          col: 6,
          rules: [
            { type: 'required' },
            { type: 'min', value: 1 },
            { type: 'max', value: Number(localStorage.getItem('value')) },
          ],
          readonly: this.form?.defaultValue?.paymentAmount != undefined,
        },
      },
    ];
  }

  transform(value: any, query = 'HH:mm - DD/MM/YYYY'): any {
    return value ? moment(value).format(query) : '';
  }

  handelSubmit() {
    const { controls: controls, value: value, valid: valid } = this.form.validateForm;
    const { id } = this.route.snapshot.params;
    const payload = {
      isOneTimePayment: false,
      ...value,
    };
    const d1 = value.paymentStartDate.valueOf();
    const d2 = new Date().valueOf();
    if (!valid) {
      this.checkControls([controls]);
      return;
    } else {
      if (d1 > d2 || moment(value.paymentStartDate).format('DD/MM/YYYY') == moment(new Date()).format('DD/MM/YYYY')) {
        if (Number(localStorage.getItem('value')) - value.firstPaymentAmount < value.paymentAmount) {
          this.message.error(this.translate.instant('Số tiền mỗi đợt không hợp lệ'));
        } else this.OrdersFacade.postPaymentSetting(id, payload);
      } else {
        this.message.error(this.translate.instant('Ngày bắt đầu không hợp lệ'));
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
}
