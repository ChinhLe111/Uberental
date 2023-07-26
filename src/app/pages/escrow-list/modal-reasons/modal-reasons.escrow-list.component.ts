import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';

import { EscrowListFacade } from '@store';
import { FormComponent } from '@core';
import { FormModel } from '@model';

@Component({
  selector: 'app-modal-reasons-escrow-list',
  templateUrl: './modal-reasons.escrow-list.component.html',
  providers: [EscrowListFacade],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalReasonsEscrowListComponent {
  @Input() isVisible: boolean = false;
  @Input() idReasons = '';
  @Output() handleCancel = new EventEmitter();

  constructor(protected escrowListFacade: EscrowListFacade) {}

  @ViewChild('formCancel') formCancel!: FormComponent;

  handelReject() {
    const { value, valid } = this.formCancel.validateForm;
    if (valid) {
      this.escrowListFacade.reject(this.idReasons, value.rejectReason);
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
