import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewEncapsulation,
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormItemRule, FormModel } from '@model';
/* eslint-disable  @typescript-eslint/no-non-null-assertion */

@Component({
  selector: 'g-form',
  templateUrl: './form.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormComponent implements OnChanges {
  @Input() columns?: FormModel[];
  @Input() textSubmit?: string;
  @Input() noLabel = false;
  @Input() loading: boolean | null = false;
  @Input() values: any;
  @Input() widthLabel = 0;
  @Input() small = false;
  @Input() idButton = 'button-submit';
  @Input() isBack = true;
  @Output() handSubmit = new EventEmitter<FormGroup>();
  @Output() handBack = new EventEmitter<FormGroup>();

  validateForm!: FormGroup;
  defaultValue: any;
  arrayKey?: string[];
  arrayAddable: any;
  $columns?: FormModel[];
  arrayTab: any = {};
  objPassword: any = {};
  constructor(private fb: FormBuilder) {}

  generatorValidation(rules?: FormItemRule[], type = '') {
    const validators: any[] = [];
    if (!!rules && rules.length > 0) {
      rules.map((rule) => {
        switch (rule.type) {
          case 'required':
            validators.push(Validators.required);
            if (!rule.message) {
              switch (type) {
                case 'date_range':
                case 'color':
                case 'radio':
                case 'select':
                case 'treeSelect':
                case 'slider':
                  rule.message = 'components.form.rulesRequiredSelect';
                  break;
                default:
                  rule.message = 'components.form.rulesRequired';
              }
            }
            break;
          case 'email':
            validators.push(Validators.email);
            if (!rule.message) {
              rule.message = 'components.form.rulesEmail';
            }
            break;
          case 'maxlength':
            validators.push(Validators.maxLength(rule.value));
            if (!rule.message) {
              rule.message = 'components.form.rulesMaxlength';
            }
            break;
          case 'minlength':
            validators.push(Validators.minLength(rule.value));
            if (!rule.message) {
              rule.message = 'components.form.rulesMinlength';
            }
            break;
          case 'min':
            validators.push(Validators.min(rule.value));
            if (!rule.message) {
              rule.message = 'components.form.rulesMin';
            }
            break;
          case 'max':
            validators.push(Validators.max(rule.value));
            if (!rule.message) {
              rule.message = 'components.form.rulesMax';
            }
            break;
          case 'custom':
            validators.push(rule.validator);
            break;
        }
        return rule;
      });
    }
    return validators;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.columns?.currentValue && changes.columns.currentValue.length > 0) {
      this.$columns = [];
      const configForm: any = {};
      this.arrayKey = [];
      if (this.values && this.values.id) {
        localStorage.setItem('id_form', this.values.id);
      } else {
        localStorage.setItem('id_form', '0');
      }
      this.arrayAddable = {};
      this.columns?.map((item: any) => {
        if (!!item.formItem) {
          if (item.formItem.type === 'autocomplete') {
            item.formItem.listAutocomplete = item.formItem.list;
          }
          if (item.formItem.type === 'addable') {
            this.arrayAddable[item.name] = [];
            configForm[item.name] = this.fb.array([]);
            this.arrayKey?.push(item.name);
          }
          if (item.formItem.type === 'tab') {
            this.arrayTab[item.name] = 0;
            configForm[item.name] = this.fb.array([]);
            item.formItem.list!.map((subItem: any) => {
              const col: any = {};
              col[item.formItem?.tab?.value] = [
                {
                  value: subItem.value,
                  disabled: !!item.formItem?.tab?.disabled,
                },
              ];
              item.formItem?.columns?.map((subCol: any) => {
                const validators: any[] = this.generatorValidation(subCol.formItem!.rules, subCol.formItem.type);
                let value = subCol.formItem?.value;
                if (this.values && this.values[item.name]) {
                  const objValue = this.values[item.name].filter(
                    (valueTab: any) => valueTab[item.formItem?.tab?.value] === subItem.value,
                  );
                  if (objValue.length > 0) {
                    value = objValue[0][subCol.name];
                  }
                }
                if (subCol.formItem.condition) {
                  subCol.formItem.show = subCol.formItem.condition(this.values);
                }
                col[subCol.name] = [
                  {
                    value,
                    disabled:
                      subCol.formItem.disabled !== undefined
                        ? subCol.formItem.disabled
                        : !(subCol.formItem?.show === undefined || subCol.formItem.show),
                  },
                  Validators.compose(validators),
                ];
                return subCol;
              });
              configForm[item.name].push(this.fb.group(col));
            });
            this.arrayKey?.push(item.name);
          }
          if (item.formItem.type !== 'tab' && item.formItem.type !== 'addable') {
            const validators: any[] = this.generatorValidation(item.formItem!.rules, item.formItem.type);
            this.arrayKey?.push(item.name);

            if (!this.values || this.values[item.name] === undefined) {
              if (item.formItem.type === 'checkbox' || item.formItem.type === 'switch') {
                if (!item.formItem.list) {
                  configForm[item.name] = [false, Validators.compose(validators)];
                } else {
                  configForm[item.name] = this.fb.array(
                    item.formItem.list.map((subCol: any) =>
                      this.fb.group({
                        value: subCol.value,
                        checked: subCol.checked,
                      }),
                    ),
                  );
                }
              } else {
                let value = item.formItem.value;
                if (item.formItem.type === 'upload' && item.formItem.modeSelect) {
                  value = [];
                }
                configForm[item.name] = [
                  {
                    value,
                    disabled:
                      item.formItem.disabled !== undefined
                        ? item.formItem.disabled
                        : !(item.formItem.show === undefined || item.formItem.show),
                  },
                  Validators.compose(validators),
                ];
              }
            } else {
              if (item.formItem.condition) {
                item.formItem.show = item.formItem.condition(this.values);
              }
              let value = this.values ? this.values[item.name] : '';

              if (item.formItem.type === 'upload' && item.formItem.modeSelect) {
                value = [];
              }
              configForm[item.name] = [
                {
                  value,
                  disabled:
                    item.formItem.disabled !== undefined
                      ? item.formItem.disabled
                      : !(item.formItem.show === undefined || item.formItem.show),
                },
                Validators.compose(validators),
              ];
            }
          }
          this.$columns!.push(item);
        }
        return item;
      });
      this.validateForm = this.fb.group(configForm);
      this.defaultValue = this.validateForm.value;
    }
    if (changes.values && !!this.validateForm) {
      if (this.values) {
        const data: any = {};
        this.arrayKey?.map((key: string) => {
          const tab: any = this.columns?.filter((item: any) => item.name === key)[0];
          if (
            typeof this.values[key] === 'object' &&
            !!this.values[key] &&
            tab!.formItem!.type !== 'date_range' &&
            tab!.formItem!.type !== 'markdown' &&
            tab!.formItem!.type !== 'upload' &&
            tab!.formItem!.type !== 'select'
          ) {
            setTimeout(() => {
              const langArr = <FormArray>this.validateForm.controls[key];
              switch (tab!.formItem!.type) {
                case 'tab':
                  const keyTab = tab!.formItem!.tab!.value;
                  const listTab = tab!.formItem!.list;
                  langArr.controls.map((item: any, index: number) => {
                    const lang = listTab![index]['value']; //  === 'vn' ? 'vi' : listTab![index]['value']
                    const value = this.values[key].filter((value: any) => value[keyTab] === lang)[0];
                    item.reset(value || { [keyTab]: lang });
                  });
                  break;
                case 'addable':
                  if (this.values[tab!.name].length) {
                    this.values[tab!.name].map((item: any) => {
                      this.addField(this.arrayAddable[tab!.name], tab!.name, tab!.formItem!.columns, item);
                    });
                  }
                  break;
              }
            }, 100);
          } else {
            data[key] = this.values[key] === undefined ? this.defaultValue[key] : this.values[key];
          }
        });
        this.validateForm.reset(data);
      } else {
        this.validateForm.reset(this.defaultValue);
      }
    }
  }

  changeTab(index: number, name: string): void {
    this.arrayTab[name] = index;
  }

  checkRequired(column: FormModel): boolean {
    return !!column.formItem?.rules && column.formItem.rules.filter((item) => item.type === 'required').length > 0;
  }

  onChangeValue(column: FormModel, target?: any, formGroup?: FormGroup): void {
    if (target !== undefined) {
      const value = typeof target === 'object' && target?.value !== undefined ? target.value : target;
      if (!!column.formItem?.autoSet) {
        column.formItem.autoSet(value, this.validateForm, formGroup);
      }
      if (column.formItem?.type === 'autocomplete') {
        column.formItem.listAutocomplete = column.formItem.list?.filter(
          (item) => item.label?.toLowerCase().indexOf(value?.toLowerCase()) !== -1,
        );
      }
      this.$columns?.map((item: any, indexItem) => {
        if (item.formItem && item.formItem.condition && this.$columns) {
          const statusCondition = item.formItem.condition(this.validateForm?.value);
          this.validateForm?.controls[item.name][statusCondition ? 'enable' : 'disable']();
          this.$columns[indexItem].formItem!.show = statusCondition;
        }
        if (item.formItem?.tab && item.formItem?.columns?.length) {
          item.formItem.columns.map((tabItem: any) => {
            if (tabItem.formItem && tabItem.formItem.condition) {
              const statusCondition = tabItem.formItem.condition(this.validateForm?.value);
              const arrays = this.validateForm.controls[item.name] as FormArray;
              for (const group of arrays.controls) {
                (group as FormGroup).controls[tabItem.name][statusCondition ? 'enable' : 'disable']();
              }
              tabItem.formItem!.show = statusCondition;
            }
          });
        }
      });
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

  submitForm(): void {
    const { controls } = this.validateForm;
    this.checkValid(controls);

    if (this.validateForm?.status === 'PENDING') {
      const formStatusChanges$ = this.validateForm?.statusChanges.subscribe(() => {
        this.handSubmit.emit(this.validateForm);
        formStatusChanges$?.unsubscribe();
      });
    } else {
      this.handSubmit.emit(this.validateForm);
    }
  }

  addField(
    array: any[] | undefined,
    name: string | undefined,
    columns: FormModel[] | undefined,
    data: any = undefined,
  ): void {
    let id = '';
    if (array && columns && name) {
      const configForm: any = {};
      columns.map((item: any) => {
        const validators: any[] = this.generatorValidation(item.formItem!.rules, item.formItem.type);
        this.arrayKey?.push(item.name);
        if (!this.values) {
          if (item.formItem.type === 'checkbox') {
            configForm[item.name] = [false, Validators.compose(validators)];
          } else {
            if (!id && !item?.formItem?.type) {
              id = name + '-' + array.length + '-' + item.name;
            }
            configForm[item.name] = [
              {
                value: item.formItem.value,
                disabled:
                  item.formItem.disabled !== undefined
                    ? item.formItem.disabled
                    : !(item.formItem.show === undefined || item.formItem.show),
              },
              Validators.compose(validators),
            ];
          }
        } else {
          if (item.formItem.condition) {
            item.formItem.show = item.formItem.condition(this.values);
          }
          if (!id && !item?.formItem?.type) {
            id = name + '-' + array.length + '-' + item.name;
          }
          configForm[item.name] = [
            {
              value: !!data ? data[item.name] : item?.formItem?.value,
              disabled:
                item.formItem.disabled !== undefined
                  ? item.formItem.disabled
                  : !(item.formItem.show === undefined || item.formItem.show),
            },
            Validators.compose(validators),
          ];
        }
      });
      if (!!id) {
        setTimeout(() => {
          document.getElementById(id)!.focus();
        }, 300);
      }
      const control = <FormArray>this.validateForm.get(name);
      control.push(this.fb.group(configForm));
      array.push({});
    }
  }

  removeField(array: any[] | undefined, index: number, name: string | undefined): void {
    if (array && name) {
      const control = <FormArray>this.validateForm.get(name);
      control.removeAt(index);
      array.splice(index, 1);
    }
  }
}
