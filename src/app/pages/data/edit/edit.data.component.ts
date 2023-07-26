import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormComponent } from '@core/form/form.component';
import { FormModel } from '@model';

import { Attachment, AttachmentTemplate, DatasFacade, DataTypesFacade, GlobalFacade, UploadFacade } from '@store';
import { getLanguage, Message } from '@utils';
import { Subject, take, takeUntil, withLatestFrom } from 'rxjs';

@Component({
  selector: 'app-edit-data',
  templateUrl: './edit.data.component.html',
  providers: [DatasFacade, DataTypesFacade, UploadFacade],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditDataComponent implements OnInit, OnDestroy {
  constructor(
    protected message: Message,
    protected route: ActivatedRoute,
    protected router: Router,
    public datasFacade: DatasFacade,
    public dataTypesFacade: DataTypesFacade,
    public uploadFacade: UploadFacade,
    private fb: FormBuilder,
    public globalFacade: GlobalFacade,
  ) {}
  language = getLanguage();
  formUpload!: FormGroup;
  templateUpload: AttachmentTemplate[] = [];

  buildForm() {
    const obj: { [key: string]: any } = {};
    this.templateUpload.forEach((item) => {
      obj[item.docType] = null;
    });
    this.formUpload = this.fb.group(obj);
  }

  private destroyed$ = new Subject<void>();
  id = '';

  ngOnInit() {
    this.globalFacade.setBreadcrumbs([
      {
        title: 'QUẢN LÝ DANH MỤC',
        link: '/data',
      },
      {
        title: 'Quản lý dữ liệu',
        link: '/data',
      },
    ]);
    this.id = this.route.snapshot.params.id;
    this.dataTypesFacade.get({});
    this.uploadFacade.attachmentTemplates$
      .pipe(takeUntil(this.destroyed$), withLatestFrom(this.uploadFacade.entityType$))
      .subscribe(([templateUpload, entityType]) => {
        if (templateUpload.length > 0 && entityType === 'data') {
          this.templateUpload = templateUpload;
          if (this.id) this.datasFacade.getById(this.id);
          else {
            this.datasFacade.setId(null);
            this.datasFacade.setIsLoading(false);
          }
          this.buildForm();
        } else this.uploadFacade.getAttachmentTemplates('data');
      });
    this.datasFacade.data$.pipe(takeUntil(this.destroyed$)).subscribe((data) => {
      if (!!this.id && data?.attachments) {
        const valueTemplateData: { [docType: string]: any } = {};
        for (const key of this.templateUpload) {
          valueTemplateData[key.docType] = data.attachments.filter((item) => item.docType == key.docType)[0];
        }
        this.formUpload.reset(valueTemplateData);
        setTimeout(() => {
          document.getElementById('translations-vn-title')?.focus();
        }, 1000);
      }
    });
    this.datasFacade.status$.pipe(takeUntil(this.destroyed$)).subscribe((status) => {
      switch (status) {
        case 'postOk':
        case 'putOk':
          this.handleBack();
      }
    });
    this.columnsData = [
      {
        name: 'type',
        title: 'routes.admin.code_types.categories',
        formItem: {
          type: 'select',
          facade: this.dataTypesFacade.list$,
          col: 6,
          rules: [{ type: 'required' }],
        },
      },
      {
        name: 'order',
        title: 'routes.admin.Layout.Order',
        formItem: {
          col: 6,
          type: 'number',
        },
      },
      {
        name: 'name',
        title: 'routes.admin.data.title',
        formItem: {
          rules: [{ type: 'required' }],
        },
      },
      {
        name: 'description',
        title: 'routes.admin.Layout.Description',
        formItem: {
          type: 'textarea',
          rows: 8,
        },
      },
      {
        title: 'routes.admin.Layout.content',
        name: 'content',
        formItem: {
          type: 'textarea',
          rows: 15,
        },
      },
    ];
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  @ViewChild('formData') formData!: FormComponent;

  handelSubmit(validateForm: FormGroup) {
    const { controls: controlsD, value: valueData, valid: validData } = this.formData.validateForm;
    const { controls, value } = validateForm;
    if (validData) {
      const attachments: Attachment[] = [];
      for (const key of this.templateUpload) {
        if (value[key.docType] != null) {
          attachments.push(value[key.docType]);
        }
      }
      const method$ = !this.id ? 'post' : 'put';
      this.datasFacade[method$](this.id, { ...valueData, attachments });
    } else {
      this.checkControls([controls, controlsD]);
    }
  }

  checkControls(controlsArray: Record<string, any>[]) {
    for (const controls of controlsArray) {
      for (const control of Object.values(controls)) {
        if (!control.controls) {
          control.markAsTouched();
          control.updateValueAndValidity();
        } else {
          this.checkControls([control.controls]);
        }
      }
    }
  }

  handleBack() {
    this.datasFacade.setId(this.route.snapshot.params.id);
    this.datasFacade.query$.pipe(takeUntil(this.destroyed$), take(1)).subscribe((query) => {
      this.router.navigate([this.language + '/data'], {
        relativeTo: this.route,
        queryParams: query || {},
        queryParamsHandling: 'merge',
      });
    });
  }

  columnsData: FormModel[] = [];
}
