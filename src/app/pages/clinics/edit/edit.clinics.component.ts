import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, Validators } from '@angular/forms';
import { FormBuilder } from '@angular/forms';

import { AddressFacade, AttachmentTemplate, UploadFacade, ClinicsFacade, GlobalFacade, CodeTypesFacade } from '@store';
import { FormModel } from '@model';
import { FormComponent } from '@core/form/form.component';
import { Subject, takeUntil, withLatestFrom } from 'rxjs';
import { Message, getLanguage } from '@utils';
import { TranslateService } from '@ngx-translate/core';

// @ts-ignore
import GLightbox from 'glightbox';

@Component({
  selector: 'app-ce-clinic',
  templateUrl: './edit.clinics.component.html',
  providers: [ClinicsFacade, AddressFacade, UploadFacade, CodeTypesFacade],
})
export class EditClinicComponent implements OnInit, OnDestroy {
  id?: string;
  private destroyed$ = new Subject<void>();

  templateUpload: AttachmentTemplate[] = [];

  constructor(
    private message: Message,
    private translate: TranslateService,
    private fb: FormBuilder,
    protected route: ActivatedRoute,
    protected router: Router,
    public clinicsFacade: ClinicsFacade,
    public addressFacade: AddressFacade,
    public uploadFacade: UploadFacade,
    public globalFacade: GlobalFacade,
    public codeTypesFacade: CodeTypesFacade,
  ) {}

  formUpload!: FormGroup;
  language = getLanguage();
  listMedicalDegree: { label: string; value: string }[] = [];

  ngOnInit() {
    this.globalFacade.setBreadcrumbs([
      {
        title: 'QUẢN LÝ DANH MỤC',
        link: '/clinics',
      },
      {
        title: 'Phòng khám',
        link: '/clinics',
      },
    ]);
    const { id } = this.route.snapshot.params;
    this.id = id;
    this.uploadFacade.attachmentTemplates$
      .pipe(takeUntil(this.destroyed$), withLatestFrom(this.uploadFacade.entityType$))
      .subscribe(([templateUpload, entityType]) => {
        if (templateUpload.length > 0 && entityType === 'clinic') {
          this.templateUpload = templateUpload;
          this.buildForm();
          this.clinicsFacade.getById(id);
        } else this.uploadFacade.getAttachmentTemplates('clinic');
      });
    this.codeTypesFacade.get({ page: 1, size: -1, filter: JSON.stringify({ type: 'MEDICAL_DEGREE' }) });
    this.codeTypesFacade.pagination$.pipe(takeUntil(this.destroyed$)).subscribe((data) => {
      if (data) {
        data.content.map((item) => {
          this.listMedicalDegree.push({ label: item.title, value: item.code });
        });
      }
    });
    this.clinicsFacade.data$.pipe(takeUntil(this.destroyed$)).subscribe((data: any) => {
      this.buildForm();
      if (data && data.id) {
        this.addressFacade.getProvinceList({});
        this.addressFacade.getDistrictList({ filter: JSON.stringify({ ParentId: data?.provinceCode }) });
        this.addressFacade.getCommuneList({ filter: JSON.stringify({ ParentId: data?.districtCode }) });
      }
      if (data && data.attachments) {
        const templateSetValue: { [docType: string]: any } = {};
        for (const key of this.templateUpload) {
          if (key.docType != 'clinic_avatar' && key.docType != 'clinic_supervisor_avatar') {
            templateSetValue[key.docType] = data.attachments.filter(
              (item: AttachmentTemplate) => item.docType == key.docType,
            );
          } else {
            templateSetValue[key.docType] = data.attachments.filter(
              (item: AttachmentTemplate) => item.docType == key.docType,
            )[0];
          }
        }
        this.formUpload.reset({
          ...data,
          ...templateSetValue,
        });
        setTimeout(() => {
          GLightbox();
        }, 300);
      }
    });
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  buildForm() {
    const obj: any = {};
    this.templateUpload.forEach((item) => {
      obj[item.docType] = [null, Validators.required];
    });
    this.formUpload = this.fb.group(obj);
  }

  @ViewChild('form') form!: FormComponent;
  @ViewChild('formSuper') formSuper!: FormComponent;

  handleSubmit(validateForm: FormGroup) {
    const { controls: controlsF, value: valueF, valid: validF } = this.form.validateForm;
    const { controls, value, valid } = validateForm;
    const { controls: controlsE, value: valueE, valid: validE } = this.formSuper.validateForm;
    const { id } = this.route.snapshot.params;
    if (!valid) this.message.error(this.translate.instant('routes.admin.clinics.error_upload'));
    if (!valid || !validE || !validF) {
      this.checkControls([controls, controlsE, controlsF]);
      return;
    }
    const attachments: AttachmentTemplate[] = [];
    for (const key of this.templateUpload) {
      if (key.docType == 'clinic_supervisor_avatar' || key.docType == 'clinic_avatar') {
        attachments.push(value[key.docType]);
      } else {
        attachments.push(...value[key.docType]);
        //delete value[key.docType];
      }
    }
    const payload = {
      ...value,
      ...valueE,
      ...valueF,
      isPinned: value.isPinned || false,
      attachments: attachments,
    };
    if (id) {
      this.clinicsFacade.put(id, payload);
      this.clinicsFacade.status$.pipe(takeUntil(this.destroyed$)).subscribe((status) => {
        if (status == 'putOk') {
          this.router.navigate([this.language + `/clinics/detail/${this.route.snapshot.params.id}`]);
        }
      });
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

  columnsForm: FormModel[] = [
    {
      name: 'name',
      title: 'routes.admin.clinics.name',
      formItem: {
        rules: [{ type: 'required' }],
      },
    },
    {
      name: 'provinceCode',
      title: 'routes.admin.clinics.province',
      formItem: {
        col: 4,
        type: 'select',
        rules: [{ type: 'required' }],
        facade: this.addressFacade.provinceList$,
        autoSet: (data, validateForm) => {
          validateForm?.controls['districtCode'].reset();
          if (data) this.addressFacade.getDistrictList({ filter: JSON.stringify({ ParentId: data }) });
        },
      },
    },
    {
      name: 'districtCode',
      title: 'routes.admin.clinics.district',
      formItem: {
        col: 4,
        type: 'select',
        rules: [{ type: 'required' }],
        facade: this.addressFacade.districtList$,
        autoSet: (data, validateForm) => {
          validateForm?.controls['communeCode'].reset();
          if (data) this.addressFacade.getCommuneList({ filter: JSON.stringify({ ParentId: data }) });
        },
      },
    },
    {
      name: 'communeCode',
      title: 'routes.admin.clinics.ward',
      formItem: {
        col: 4,
        type: 'select',
        rules: [{ type: 'required' }],
        facade: this.addressFacade.communeList$,
      },
    },
    {
      name: 'address',
      title: 'routes.admin.clinics.address',
      formItem: {
        rules: [{ type: 'required' }],
      },
    },
    {
      name: 'workingTimeDescription',
      title: 'routes.admin.clinics.Timeserving',
      formItem: {
        col: 3,
        rules: [{ type: 'required' }],
      },
    },
    {
      name: 'totalMachineSeats',
      title: 'routes.admin.clinics.total_machine_seats',
      formItem: {
        col: 3,
        type: 'number',
        rules: [{ type: 'min', value: 0 }, { type: 'required' }],
      },
    },
    {
      name: 'totalWorkingYear',
      title: 'routes.admin.clinics.total_working_year',
      formItem: {
        col: 3,
        type: 'number',
        rules: [{ type: 'min', value: 0 }, { type: 'required' }],
      },
    },
    {
      name: 'totalEmployee',
      title: 'routes.admin.clinics.total_employee',
      formItem: {
        col: 3,
        type: 'number',
        rules: [{ type: 'min', value: 0 }, { type: 'required' }],
      },
    },
    {
      name: 'serviceDescription',
      title: 'routes.admin.clinics.serviceDescription',
      formItem: {
        type: 'textarea',
        rules: [{ type: 'required' }],
      },
    },
  ];
  columnsFormSupper: FormModel[] = [
    {
      name: 'supervisorName',
      title: 'routes.admin.clinics.supervisorName',
      formItem: {
        rules: [{ type: 'required' }],
      },
    },
    {
      name: 'medicalDegreeCode',
      title: 'routes.admin.clinics.professional_qualifications',
      formItem: {
        type: 'select',
        list: this.listMedicalDegree,
        rules: [{ type: 'required' }],
      },
    },
    {
      name: 'supervisorDescription',
      title: 'routes.admin.clinics.supervisorDescription',
      formItem: {
        type: 'textarea',
        rules: [{ type: 'required' }],
      },
    },
  ];
}
