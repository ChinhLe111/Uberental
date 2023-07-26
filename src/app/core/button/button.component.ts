import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'g-button',
  templateUrl: './button.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent {
  @Input() extendClass?: string;
  @Input() disabled?: boolean | null = false;
  @Input() id?: string;
  @Input() text?: string;
  @Input() title?: string;
  @Input() icon?: string;
  @Input() loading?: boolean | null = false;
  @Output() onPaste = new EventEmitter();
}
