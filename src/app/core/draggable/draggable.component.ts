import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  forwardRef,
  Input,
  OnInit,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { Swappable } from '@shopify/draggable';
import { Guid } from 'guid-typescript';
@Component({
  selector: 'g-draggable',
  templateUrl: './draggable.component.html',
  styleUrls: ['./draggable.component.less'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DraggableComponent),
      multi: true,
    },
  ],
})
export class DraggableComponent implements OnInit {
  public id: Guid;
  private index = -1;
  private indexNext = -1;

  @Input() listData: any;
  @Output() onClick = new EventEmitter<any>();
  constructor() {
    this.id = Guid.create();
  }
  ngOnInit(): void {
    setTimeout(() => {
      const containers = document.getElementById('draggable' + this.id);

      if (containers) {
        const draggable = new Swappable(containers, {
          draggable: '.draggable',
          handle: '.handle',
          mirror: {
            constrainDimensions: true,
          },
        });
        draggable.on('drag:out', ({ over, originalSource }) => {
          if (over.id !== originalSource.id) {
            this.indexNext = parseInt(over.id);
          }
        });
        draggable.on('drag:stop', ({ originalSource }) => {
          const dataPrev = this.listData[originalSource.id];
          const dataNext = this.listData[this.indexNext];
          if (dataPrev && dataNext) {
            this.listData.splice(originalSource.id, 1, { ...dataNext, col: dataPrev.col });
            this.listData.splice(this.indexNext, 1, { ...dataPrev, col: dataNext.col });
            this.onChange(this.listData);
          }
        });
      }
    });
  }

  convertCSS(): string {
    let css = '';
    if (this.listData?.length) {
      this.listData.forEach((item: any, index: number) => {
        if (index === 0) {
          css += `#draggable${this.id} .draggable:first-child {grid-column: span ${item.col} / span ${item.col};}`;
        } else {
          css += `#draggable${this.id} .draggable:nth-child(${index + 1}) {grid-column: span ${item.col} / span ${
            item.col
          };} #draggable${this.id} .draggable.draggable--original~.draggable:nth-child(${
            index + 2
          }) {grid-column: span ${item.col} / span ${item.col};}`;
        }
      });
    }
    return css;
  }

  delete(index: number): void {
    this.listData.splice(index, 1);
    this.updateStyle();
  }
  updateStyle(): void {
    const style: any = document.getElementById('style' + this.id);
    style.innerHTML = '';
    style.appendChild(document.createTextNode(this.convertCSS()));
    this.onChange(this.listData);
  }
  handleEdit(data: any, index: number): void {
    this.index = index;
    this.onClick.emit({ data, handleOk: this.handleOk });
  }
  handleOk = (value: any): void => {
    if (this.index > -1) {
      this.listData.splice(this.index, 1, value);
    } else {
      this.listData.push(value);
    }
    this.updateStyle();
  };
  get value() {
    return this.listData || [];
  }
  set value(val) {
    this.listData = val || [];
    this.onChange(val || []);
  }
  onChange = (value: any) => {
    this.listData = value || [];
  };
  onTouch: any = (value: any) => {
    this.listData = value || [];
  };
  writeValue: any = (value: any) => {
    this.listData = value || [];
    const head = document.getElementsByTagName('head')[0];
    const style = document.createElement('style');
    style.setAttribute('id', 'style' + this.id);
    style.type = 'text/css';
    style.appendChild(document.createTextNode(this.convertCSS()));
    head.appendChild(style);
  };
  registerOnChange(fn: () => void) {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouch = fn;
  }
}
