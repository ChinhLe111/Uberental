import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  forwardRef,
  Input,
  Output,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { finalize } from 'rxjs';
import { HttpClient } from '@angular/common/http';
// @ts-ignore
import GLightbox from 'glightbox';

import { environment } from '@src/environments/environment';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'g-upload',
  templateUrl: './upload.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UploadComponent),
      multi: true,
    },
  ],
})
export class UploadComponent {
  @Input() title?: string;
  @Input() pasteTitle?: string;
  @Input() multiple = false;
  @Input() isFile = false;
  @Input() cols = 2;
  @Input() url: any;
  @Input() physicalPath?: string;
  @Input() enityId?: string;
  @Input() isDescription?: boolean = true;
  @Output() handleChange = new EventEmitter();
  public typeImage = ['jpg', 'png', 'jpeg', 'JPG', 'PNG', 'JPEG'];
  public isUploading = false;
  @ViewChild('fileUpload') fileUpload!: HTMLInputElement;
  visible = false;
  constructor(protected http: HttpClient, private cdr: ChangeDetectorRef) {
    this.url = !this.multiple ? '' : [];
    setTimeout(() => {
      GLightbox();
      this.cdr.detectChanges();
    }, 300);
  }

  customReq = (event: any, type: string) => {
    this.isUploading = true;
    const file: File = type == 'paste' ? event.file : event.target.files[0];
    if (this.typeImage.indexOf(file.name.split('.')[file.name.split('.').length - 1]) === -1) {
      setTimeout(() => {
        this.isUploading = false;
        this.cdr.detectChanges();
      });
      return true;
    }
    const data = new FormData();
    data.append('file', file);
    if (this.enityId) data.append('enityId', this.enityId);
    if (!this.multiple) this.url = '';
    return this.http
      .post(`${environment.apiUrl}upload/blob/${this.physicalPath}`, data)
      .pipe(finalize(() => (this.isUploading = false)))
      .subscribe((response: any) => {
        if (response.code === 200) {
          if (!this.multiple) {
            this.url = response.data;
          } else if (typeof this.url === 'object') {
            if (!this.url) this.url = [];
            this.url.push(response.data);
          }
          this.onChange(this.url);
        }
      });
  };

  onPaste(event: any): void {
    const items = (event.clipboardData || event.originalEvent.clipboardData).items;
    for (const index in items) {
      if (items.hasOwnProperty(index)) {
        const item = items[index];
        if (item.kind === 'file') {
          const blob = item.getAsFile();
          this.customReq(
            {
              file: new File(
                [blob],
                `post-cover-${Date.now()}${'.' + blob.name.split('.').pop().toLowerCase()}`,
              ) as any,
            },
            'paste',
          );
        }
      }
    }
  }

  removeImage(url: string, index?: number) {
    if (typeof this.url === 'object' && this.multiple && index !== undefined) {
      this.url.splice(index, 1);
    } else {
      this.url = '';
    }
    this.onChange(this.url);
  }

  array_move(arr: any[], old_index: number, new_index: number) {
    if (new_index >= arr.length) {
      let k = new_index - arr.length + 1;
      while (k--) {
        arr.push(undefined);
      }
    }
    arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
    return arr.filter((item) => !!item);
  }

  moverImage(index: number, new_index: number) {
    if (this.multiple) {
      this.url = this.array_move(this.url, index, new_index);
      this.onChange(this.url);
    }
  }

  changeDescription(el: any, index: number): void {
    this.isUploading = true;
    if (this.multiple) {
      const data = this.url.map((item: any, i: number) => {
        if (index === i) return { ...item, description: el.target.value };
        return item;
      });
      this.onChange(data);
    } else this.onChange({ ...this.url, description: el.target.value });
  }
  get value() {
    return this.url;
  }

  set value(val: string | string[]) {
    this.url = val;
    this.onChange(val);
  }

  onChange = (value: any) => {
    this.handleChange.emit(value);
    this.change(value);
    this.url = value;
    setTimeout(() => {
      this.isUploading = false;
      this.cdr.detectChanges();
      GLightbox();
    });
  };

  onTouch: any = (value: string | string[]) => {
    this.url = value;
  };

  writeValue: any = (value: string | string[]) => {
    this.url = value;
  };

  change: any;

  registerOnChange(fn: () => void) {
    this.change = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouch = fn;
  }
}
