import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { FormModel } from '@model';

@Component({
  selector: 'g-modal-form',
  templateUrl: './modal-form.component.html',
  styleUrls: ['./modal-form.component.less'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalFormComponent implements OnChanges {
  @Input() columns?: FormModel[];
  @Input() loading = false;
  @Input() firstLoad = true;
  @Input() values: any;
  @Input() widthLabel = 0;
  @Input() title?: string;
  @Input() visible = false;
  @Input() extendModalTop: any;
  @Input() extendModalLeft: any;
  @Input() widthModalLeft: any;
  @Input() extendModal: any;
  @Input() extendFooterButton: any;
  @Input() width = 1200;
  @Input() okText?: string;
  @Input() cancelText?: string;
  @Input() classModal = '';
  @Input() showForm = true;
  @Input() okDisabled = false;
  @Input() fullScreen = false;

  @Output() clickOk = new EventEmitter();
  @Output() clickCancel = new EventEmitter();

  @ViewChild('myForm') ngForm?: any;

  isLoading = false;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.visible?.currentValue && !!changes.visible.currentValue && !!this.ngForm?.validateForm) {
      this.ngForm.validateForm.reset(this.ngForm.defaultValue);
    }
  }

  checkValid(controls: any): void {
    for (const i in controls) {
      if (controls.hasOwnProperty(i)) {
        controls[i].markAsDirty();
        controls[i].updateValueAndValidity();
        if (controls[i]?.controls) {
          this.checkValid(controls[i]?.controls);
        }
      }
    }
  }

  handleOk(): void {
    this.isLoading = false;
    this.ngForm.isLoading = false;
    const { controls, statusChanges } = this.ngForm.validateForm;
    this.checkValid(controls);

    if (this.ngForm.validateForm.status !== 'INVALID') {
      this.isLoading = true;
      this.ngForm.isLoading = true;
    }
    if (this.ngForm.validateForm.status === 'PENDING') {
      statusChanges.subscribe(() => {
        this.clickOk.emit(this.ngForm.validateForm);
      });
    } else {
      this.clickOk.emit(this.ngForm.validateForm);
    }
  }

  handleCancel(): void {
    this.clickCancel.emit();
  }
}
