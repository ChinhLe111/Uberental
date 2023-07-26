import { ChangeDetectionStrategy, Component, forwardRef, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { Guid } from 'guid-typescript';
import EditorJS, { OutputData } from '@editorjs/editorjs';

import { editorjsConfig } from './editor.config';

@Component({
  selector: 'g-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.less'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => EditorComponent),
      multi: true,
    },
  ],
})
export class EditorComponent implements OnInit {
  @Input() data?: OutputData;

  private editor?: EditorJS;
  public id: Guid;

  constructor() {
    this.id = Guid.create();
  }

  ngOnInit(): void {
    setTimeout(() => {
      const el: any = document.getElementById('editorjs' + this.id);
      if (el) {
        this.editor = new EditorJS({
          ...editorjsConfig,
          holder: 'editorjs' + this.id,
          onChange: async (api) => this.onChange(await api.saver.save()),
          data: this.data,
        });
        setTimeout(() => {
          if (!!el.firstElementChild.className) {
            el.firstElementChild.className += ' codex-editor--narrow';
          }
        }, 100);
      }
    });
  }
  onPaste(): void {
    setTimeout(() => {
      this?.editor?.blocks?.insert();
    }, 300);
  }

  get value() {
    return this.data;
  }
  set value(val) {
    this.data = val;
  }
  writeValue: any = (value: any) => {
    this.data = value;
    if (value) {
      setTimeout(() => {
        if (value?.blocks?.length == 0) {
          value.blocks = [
            {
              id: 'sCHe389Xee',
              type: 'paragraph',
              data: {
                text: '',
              },
            },
          ];
        }
        this?.editor?.blocks?.render(value);
      }, 500);
    }
  };
  onChange: any;
  registerOnChange(fn: () => void) {
    this.onChange = fn;
  }
  onTouch: any;
  registerOnTouched(fn: () => void): void {
    this.onTouch = fn;
  }
}
