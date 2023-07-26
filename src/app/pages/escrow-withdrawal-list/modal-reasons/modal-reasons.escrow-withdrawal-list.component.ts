import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';

import { EscrowWithdrawalListFacade } from '@store';
import { FormComponent } from '@core';
import { FormModel } from '@model';

@Component({
  selector: 'app-modal-reasons-escrow-withdrawal-list',
  templateUrl: './modal-reasons.escrow-withdrawal-list.component.html',
  styles: [
    `
      .ant-radio-group {
        display: block;
        height: 32px;
        line-height: 32px;
      }
    `,
  ],
  providers: [EscrowWithdrawalListFacade],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalReasonsEscrowWithdrawalListComponent {
  @Input() isVisible: boolean = false;
  @Input() idReasons = '';
  @Output() handleCancel = new EventEmitter();

  constructor(protected escrowWithdrawalListFacade: EscrowWithdrawalListFacade) {
    this.escrowWithdrawalListFacade.getReasons();
  }

  @ViewChild('formCancel') formCancel!: FormComponent;
  radioValue = '';

  handelReject() {
    if (this.formCancel) {
      const { value, valid } = this.formCancel.validateForm;
      if (valid) {
        this.escrowWithdrawalListFacade.reject(this.idReasons, value.rejectReason);
      }
    } else {
      this.escrowWithdrawalListFacade.reject(this.idReasons, this.radioValue);
    }
  }

  columnsCancel: FormModel[] = [
    {
      name: 'rejectReason',
      title: '',
      formItem: {
        type: 'textarea',
        rules: [{ type: 'required' }],
      },
    },
  ];
}
