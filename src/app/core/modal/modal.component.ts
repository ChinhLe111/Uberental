import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'g-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.less'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalComponent {
  @Input() loading?: boolean;
  @Input() title?: string;
  @Input() visible?: boolean;
  @Input() contentModal: any;
  @Input() extendFooterButton: any;
  @Input() width = 1200;
  @Input() notFooter = false;
  @Input() okDisabled = false;
  @Input() keyboard = true;
  @Input() classModal = '';
  @Input() idButton = 'button-submit';
  @Input() fullScreen = false;

  @Output() clickOk = new EventEmitter();
  @Output() clickCancel = new EventEmitter();

  @Input() okText?: string;
  @Input() cancelText?: string;

  afterOpen(): void {
    const modals: any = document.getElementsByClassName('ant-modal');
    for (let i = 0; i < modals.length; i++) {
      if (
        modals[i].scrollHeight + 15 < window.innerHeight &&
        !modals[i].querySelector('.ant-spin-spinning') &&
        !modals[i].classList.contains('modal-not-center')
      ) {
        modals[i].parentElement?.classList.remove('no-center');
      } else {
        modals[i].parentElement?.classList.add('no-center');
      }
      if (modals[i].children[0]) {
        setTimeout(() => {
          modals[i].children[0]['style'].minHeight = modals[i].children[0]['offsetHeight'] + 'px';
        }, 500);
      }
    }
  }

  handleCancel(): void {
    this.clickCancel.emit();
  }

  handleOk(): void {
    this.clickOk.emit();
  }
}
