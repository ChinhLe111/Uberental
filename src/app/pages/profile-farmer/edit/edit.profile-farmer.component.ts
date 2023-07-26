import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil, withLatestFrom } from 'rxjs';

import {
  AddressFacade,
  Attachment,
  AttachmentTemplate,
  CodeTypesFacade,
  GlobalFacade,
  MedicalProcedureFacade,
  ProfileFarmerFacade,
  UploadFacade,
} from '@store';
import { FormModel } from '@model';
import { FormComponent } from '@core/form/form.component';
import { Message, getLanguage } from '@utils';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-edit-profile-farmer',
  templateUrl: './edit.profile-farmer.component.html',
  providers: [
    Message,
    ProfileFarmerFacade,
    MedicalProcedureFacade,
    CodeTypesFacade,
    AddressFacade,
    UploadFacade,
    GlobalFacade,
  ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditProfileFarmerComponent implements OnInit, OnDestroy {
  constructor(
    protected route: ActivatedRoute,
    protected router: Router,
    protected fb: FormBuilder,
    private message: Message,
    private translate: TranslateService,
    private globalFacade: GlobalFacade,
    public profileFarmerFacade: ProfileFarmerFacade,
    public medicalProcedureFacade: MedicalProcedureFacade,
    public codeTypesFacade: CodeTypesFacade,
    public addressFacade: AddressFacade,
    public uploadFacade: UploadFacade,
  ) {}

  formUpload!: FormGroup;
  language = getLanguage();

  private buildFormUpload() {
    const obj: any = {};
    this.templateUpload.forEach((item) => {
      obj[item.docType] = [null, Validators.required];
    });
    this.formUpload = this.fb.group(obj);
  }

  private destroyed$ = new Subject<void>();
  templateUpload: AttachmentTemplate[] = [];
  listMedicalProcedure: { label: string; value: string }[] = [];
  listCodeTypes: { label: string; value: string }[] = [];

  ngOnInit(): void {
    this.globalFacade.setBreadcrumbs([
      {
        title: 'routes.admin.profile-farmer.CATEGORY_MANAGEMENT',
        link: '/profile-farmer',
      },
      {
        title: 'Profile Farmer',
        link: '/profile-farmer',
      },
    ]);
    const { id } = this.route.snapshot.params;
    this.uploadFacade.attachmentTemplates$
      .pipe(takeUntil(this.destroyed$), withLatestFrom(this.uploadFacade.entityType$))
      .subscribe(([templateUpload, entityType]) => {
        if (templateUpload.length > 0 && entityType === 'farmer') {
          this.templateUpload = templateUpload;
          this.buildFormUpload();
          if (id) this.profileFarmerFacade.getById(id);
        } else this.uploadFacade.getAttachmentTemplates('farmer');
      });
    this.medicalProcedureFacade.get({ page: 1, size: -1 });
    this.medicalProcedureFacade.pagination$.pipe(takeUntil(this.destroyed$)).subscribe((data) => {
      if (data) {
        data.content.map((item) => {
          this.listMedicalProcedure.push({ label: item.name, value: item.code });
        });
      }
    });
    this.codeTypesFacade.get({ page: 1, size: -1, filter: JSON.stringify({ type: 'MEDICAL_DEGREE' }) });
    this.codeTypesFacade.pagination$.pipe(takeUntil(this.destroyed$)).subscribe((data) => {
      if (data) {
        data.content.map((item) => {
          this.listCodeTypes.push({ label: item.title, value: item.code });
        });
      }
    });
    this.profileFarmerFacade.data$.pipe(takeUntil(this.destroyed$)).subscribe((data) => {
      if (data) {
        this.addressFacade.getProvinceList({});
        this.addressFacade.getDistrictList({ filter: JSON.stringify({ ParentId: data?.provinceCode }) });
        this.addressFacade.getCommuneList({ filter: JSON.stringify({ ParentId: data?.districtCode }) });
        if (data.attachments) {
          const valueTemplate: { [docType: string]: any } = {};
          for (const key of this.templateUpload) {
            if (key?.docType?.split('_')[key?.docType?.split('_').length - 1] == 'avatar') {
              valueTemplate[key.docType] = data.attachments.filter((item) => item.docType == key.docType);
              valueTemplate[key.docType] = valueTemplate[key.docType][0];
            } else {
              valueTemplate[key.docType] = data.attachments.filter((item) => item.docType == key.docType);
            }
          }
          this.formUpload.reset({
            ...data,
            ...valueTemplate,
          });
        }
      }
    });
    this.setForm();
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  handleBack() {
    this.profileFarmerFacade.setId(this.route.snapshot.params.id);
    this.router.navigate([this.language + '/profile-farmer']);
  }

  @ViewChild('formInfo') formInfo!: FormComponent;

  handleSubmit(validateForm: FormGroup) {
    const { id } = this.route.snapshot.params;
    const { controls: controlsInfo, value: valueInfo, valid: validInfo } = this.formInfo.validateForm;
    const { controls, value, valid } = validateForm;
    if (!valid)
      this.message.error(this.translate.instant('routes.admin.profile-farmer.you_have_to_upload_all_the_pictures'));
    if (!valid || !validInfo) {
      this.checkControls([controls, controlsInfo]);
      return;
    }
    if (validInfo && valid) {
      const attachments: Attachment[] = [];
      for (const key of this.templateUpload) {
        if (key.docType.split('_')[key.docType.split('_').length - 1] == 'avatar') {
          attachments.push(value[key.docType]);
        } else {
          attachments.push(...value[key.docType]);
        }
      }
      this.profileFarmerFacade.put(id, { ...valueInfo, attachments });
      this.profileFarmerFacade.status$.pipe(takeUntil(this.destroyed$)).subscribe((status) => {
        if (status == 'putOk') {
          this.router.navigate([this.language + '/profile-farmer', this.route.snapshot.params.id]);
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

  columnsFormInfo: FormModel[] = [];

  private setForm() {
    this.columnsFormInfo = [
      {
        name: 'name',
        title: 'routes.admin.profile-farmer.first_and_last_name',
        formItem: {
          col: 8,
          rules: [{ type: 'required' }],
        },
      },
      {
        name: 'gender',
        title: 'routes.admin.profile-farmer.gender',
        formItem: {
          col: 4,
          type: 'select',
          list: [
            { label: 'Nam', value: 'MALE' },
            { label: 'Nữ', value: 'FEMALE' },
          ],
          rules: [{ type: 'required' }],
        },
      },
      {
        name: 'provinceCode',
        title: 'routes.admin.profile-farmer.province',
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
        title: 'routes.admin.profile-farmer.district',
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
        title: 'routes.admin.profile-farmer.commune',
        formItem: {
          col: 4,
          type: 'select',
          rules: [{ type: 'required' }],
          facade: this.addressFacade.communeList$,
        },
      },
      {
        name: 'address',
        title: 'routes.admin.profile-farmer.address',
        formItem: {
          rules: [{ type: 'required' }],
        },
      },
      {
        name: 'medicalProcedureListCode',
        title: 'routes.admin.profile-farmer.medical_procedure_list',
        formItem: {
          type: 'select',
          modeSelect: 'multiple',
          list: this.listMedicalProcedure,
          rules: [{ type: 'required' }],
        },
      },
      {
        name: 'medicalDegreeCode',
        title: 'routes.admin.profile-farmer.medical_degree',
        formItem: {
          col: 8,
          type: 'select',
          list: this.listCodeTypes,
          rules: [{ type: 'required' }],
        },
      },
      {
        name: 'totalYearOfExperience',
        title: 'routes.admin.profile-farmer.total_year_of_experience',
        formItem: {
          col: 4,
          type: 'number',
          rules: [{ type: 'min', value: 1 }, { type: 'required' }],
        },
      },
      {
        name: 'workingProcessDescription',
        title: 'routes.admin.profile-farmer.working_process_description',
        formItem: {
          type: 'textarea',
          rules: [{ type: 'required' }],
        },
      },
    ];
  }
}
