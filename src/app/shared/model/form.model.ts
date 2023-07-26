import { TemplateRef } from '@angular/core';
import { FormGroup, ValidatorFn } from '@angular/forms';
import { NzTreeNode, NzTreeNodeOptions } from 'ng-zorro-antd/tree';
import { NzMarks } from 'ng-zorro-antd/slider/typings';
export class FormModel {
  name?: string;
  title?: string;
  formItem?: FormItem;
}

export class FormItem {
  type?:
    | 'markdown'
    | 'number'
    | 'mask'
    | 'password'
    | 'textarea'
    | 'autocomplete'
    | 'date'
    | 'date_range'
    | 'checkbox'
    | 'color'
    | 'radio'
    | 'select'
    | 'treeSelect'
    | 'upload'
    | 'switch'
    | 'slider'
    | 'only-text'
    | 'addable'
    | 'tab'
    | 'html'
    | 'layout';
  title?: (value?: string) => any;
  value?: any;
  formatDate?: string;
  showTime?: boolean;
  tooltip?: string;
  confirm?: boolean;
  html?: string;
  mask?: string;
  maskPrefix?: string;
  number?: boolean;
  autoSet?: (value?: string, validateForm?: FormGroup, formGroup?: FormGroup) => void;
  onSearch?: (value?: string) => void;
  readonly?: boolean;
  show?: boolean;
  noLabel?: boolean;
  viewTable?: boolean;
  rules?: FormItemRule[];
  list?: FormItemList[];
  facade?: any;
  listAutocomplete?: FormItemList[];
  tab?: FormItemTab;
  addOnBefore?: string | string[] | Set<string> | { [klass: string]: any };
  addOnAfter?: string | string[] | Set<string> | { [klass: string]: any };
  placeholder?: string;
  addableText?: string;
  col?: number;
  condition?: (value?: string) => boolean;
  render?: TemplateRef<any> | null;
  columns?: FormModel[];
  listNode?: (NzTreeNodeOptions | NzTreeNode)[];
  customOptionContent?: (value?: FormItemList) => void;
  renderIcon?: (value?: string) => string;
  rows?: number;
  onPaste?: (event?: ClipboardEvent, name?: string, value?: any, index?: number) => void;
  onClick?: (value?: string | any) => void;
  widthTable?: string;
  modeSelect?: 'multiple' | 'tags' | 'default';
  min?: number;
  max?: number;
  sliderMarks?: NzMarks | null;
  formatMarks?: (value: number) => string;
}
export class FormItemList {
  label?: string;
  value: any;
  danger?: boolean;
  checked?: boolean;
}

export class FormItemRule {
  type?: string;
  message?: string;
  value?: any;
  validator?: ValidatorFn;
}

export class FormItemTab {
  label?: string;
  value: any;
  disabled?: boolean;
}
