import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NzTreeNode, NzTreeNodeOptions } from 'ng-zorro-antd/tree';
import { Subject, takeUntil } from 'rxjs';
import { Message } from '@utils';
import { GlobalFacade, Parameter, ParametersFacade } from '@store';
import { FormComponent } from '@core/form/form.component';
import { FormModel } from '@model';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-parameter',
  templateUrl: './parameter.component.html',
  providers: [ParametersFacade],
})
export class ParameterComponent implements OnInit, OnDestroy {
  @ViewChild('form') form!: FormComponent;
  private destroyed$ = new Subject<void>();

  searchValue = '';

  constructor(
    public globalFacade: GlobalFacade,
    protected message: Message,
    public parametersFacade: ParametersFacade,
    private cdr: ChangeDetectorRef,
  ) {}

  nodes: NzTreeNodeOptions[] = [];
  columnsForm: FormModel[] = [];
  ngOnInit(): void {
    this.globalFacade.setBreadcrumbs([
      {
        title: 'SUPERADMIN',
        link: '/navigation',
      },
      {
        title: 'Cấu hình hệ thống',
        link: '/post',
      },
    ]);
    this.parametersFacade.getall();
    this.parametersFacade.status$.subscribe((value) => {
      switch (value) {
        case 'postOk':
        case 'putOk':
        case 'deleteOk':
          this.parametersFacade.getall();
          break;
      }
    });
    this.parametersFacade.list$.pipe(takeUntil(this.destroyed$)).subscribe((data) => {
      if (data.length) {
        this.nodes = JSON.parse(JSON.stringify(data));
        this.columnsForm = [
          {
            name: 'name',
            title: 'routes.admin.parameter.parametername',
            formItem: {
              col: 6,
              rules: [
                {
                  type: 'required',
                },
              ],
            },
          },
          {
            name: 'value',
            title: 'routes.admin.parameter.parametervalue',
            formItem: {
              col: 6,
              rules: [
                {
                  type: 'required',
                },
              ],
            },
          },
          {
            name: 'groupCode',
            title: 'routes.admin.parameter.group',
            formItem: {
              col: 6,
              type: 'autocomplete',
              list: this.nodes.map((i: any) => ({ value: i.key, label: i.title })),
            },
          },
          {
            name: 'isSystem',
            title: 'routes.admin.parameter.system',
            formItem: {
              col: 6,
              type: 'switch',
              readonly: true,
            },
          },
          {
            name: 'description',
            title: 'routes.admin.parameter.note',
            formItem: {
              type: 'textarea',
            },
          },
        ];
        this.cdr.detectChanges();
      }
    });
  }
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  isShowForm = false;
  selectedNode: NzTreeNode | null = null;
  data?: Parameter;
  onAddNew(): void {
    this.selectedNode = null;
    this.data = undefined;
    this.isShowForm = true;
    setTimeout(() => {
      !!this.form && this.form.validateForm.reset({});
    });
  }
  onSaveNode(form: FormGroup): void {
    const { valid } = form;
    if (valid) {
      const value = form.getRawValue();
      if (this.selectedNode) this.parametersFacade.put(this.data?.id || '', value);
      else this.parametersFacade.post(value);
    }
  }

  onSelectNode(event: any): void {
    if (event?.node?.origin?.isGroup) {
      this.selectedNode = null;
      return;
    }
    if (event?.nodes?.length > 0) {
      this.selectedNode = event.node;
      this.data = event.node.origin;
      this.isShowForm = true;
    } else {
      this.selectedNode = null;
      this.data = event.node.origin;
      this.isShowForm = false;
    }
  }

  async onDelete(item: any) {
    this.isShowForm = false;
    this.selectedNode = null;
    this.parametersFacade.delete(item?.origin.id);
  }
}
