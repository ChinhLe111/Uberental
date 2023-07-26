import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { FormModel } from '@model';
import { PostsFacade, PostCategoriesFacade, UploadFacade, AttachmentTemplate, Posts } from '@store';
import { Message, getLanguage } from '@utils';
import { Subject, take, takeUntil, withLatestFrom } from 'rxjs';
import { FormComponent } from '@core/form/form.component';
import slug from 'slug';

@Component({
  selector: 'app-edit.post',
  templateUrl: './edit.post.component.html',
  providers: [PostsFacade, PostCategoriesFacade, UploadFacade],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditPostComponent implements OnInit, OnDestroy {
  @ViewChild('postForm') postForm!: FormComponent;
  @ViewChild('extraForm') extraForm!: FormComponent;
  @ViewChild('titleSeo') titleSeo!: any;
  private destroyed$ = new Subject<void>();

  id?: string;
  editformat?: string;
  postData: any;
  validateForm!: FormGroup;
  templateUpload: AttachmentTemplate[] = [];
  data?: Posts;
  postColumns: FormModel[] = [];
  language = getLanguage();

  constructor(
    protected message: Message,
    protected route: ActivatedRoute,
    protected router: Router,
    public postsFacade: PostsFacade,
    public postCategoriesFacade: PostCategoriesFacade,
    public uploadFacade: UploadFacade,
    private fb: FormBuilder,
  ) {}

  buildForm() {
    const obj: any = {
      formatType: ['STANDARD', Validators.required],
    };
    this.templateUpload.forEach((item) => {
      obj[item.docType] = null;
    });
    this.validateForm = this.fb.group(obj);
  }

  ngOnInit() {
    this.id = this.route.snapshot.params.id;
    this.postCategoriesFacade.get({});

    this.uploadFacade.attachmentTemplates$
      .pipe(takeUntil(this.destroyed$), withLatestFrom(this.uploadFacade.entityType$))
      .subscribe(([templateUpload, entityType]) => {
        if (templateUpload.length > 0 && entityType === 'post') {
          this.templateUpload = templateUpload;
          if (this.id) this.postsFacade.getById(this.id);
          else {
            this.data = {};
            this.postsFacade.setId(null);
            this.postsFacade.setIsLoading(false);
          }
          this.buildForm();
        } else this.uploadFacade.getAttachmentTemplates('post');
      });
    this.postsFacade.data$.pipe(takeUntil(this.destroyed$)).subscribe((data) => {
      if (data && this.id) {
        this.data = JSON.parse(JSON.stringify(data));
        this.buildForm();
        if (this.data) {
          this.editformat = this.data.editorFormat;
          this.data.translations = this.data?.translations?.map((item: any) => {
            if (data.editorFormat === 'BLOCK') {
              item.contentStringBlock = JSON.parse(item?.contentString);
              if (!item?.contentString) {
                item.contentStringBlock = {
                  blocks: [
                    {
                      id: 'sCHe389Xee',
                      type: 'paragraph',
                      data: {
                        text: '',
                      },
                    },
                  ],
                  time: 1667209391241,
                  version: '2.25.0',
                };
              }
            } else {
              item.contentStringHtml = item?.contentString;
            }
            return item;
          });
        }
        this.postData = {
          ...this.data,
          isPinned: this.data?.isPinned || false,
          categoryId: this.data?.category?.id,
        };
        this.data?.attachments?.forEach((subItem: any) => (this.postData[subItem.docType] = subItem));
        this.validateForm.reset(this.postData);
      }
    });
    this.postsFacade.status$.pipe(takeUntil(this.destroyed$)).subscribe((status) => {
      switch (status) {
        case 'postOk':
        case 'putOk':
          this.handleBack();
      }
    });

    this.editformat = 'BLOCK';
    this.postColumns = [
      {
        name: 'editorFormat',
        title: 'routes.admin.post.editorFormat',
        formItem: {
          type: 'radio',
          list: [
            { label: 'Block', value: 'BLOCK' },
            { label: 'Html', value: 'HTML' },
          ],
          value: 'BLOCK',
          autoSet: (value: any) => {
            this.editformat = value;
          },
        },
      },
      {
        name: 'categoryId',
        title: 'routes.admin.post.categories',
        formItem: {
          type: 'select',
          facade: this.postCategoriesFacade.list$,
          rules: [{ type: 'required' }],
          col: 4,
        },
      },
      {
        name: 'translations',
        title: 'routes.admin.code_types.translations',
        formItem: {
          type: 'tab',
          tab: {
            label: 'language',
            value: 'language',
          },
          list: [
            { label: 'Tiếng Việt', value: 'vn' },
            { label: 'English', value: 'en' },
          ],
          columns: [
            {
              name: 'title',
              title: 'routes.admin.post.title',
              formItem: {
                rules: [{ type: 'required' }],
                autoSet: (value, fors, formGroup) => {
                  const slugInput = formGroup?.get('seoUrl');
                  if (value && !slugInput?.value) {
                    slugInput?.setValue(slug(value));
                  }
                },
              },
            },
            {
              name: 'seoUrl',
              title: 'routes.admin.post.seoUrl',
              formItem: {},
            },
            {
              name: 'author',
              title: 'routes.admin.post.author',
              formItem: {},
            },
            {
              name: 'coverUrlDescription',
              title: 'routes.admin.post.coverImageDescription',
              formItem: {},
            },
            {
              name: 'summary',
              title: 'routes.admin.post.introduce',
              formItem: {
                type: 'textarea',
                rows: 5,
              },
            },
            {
              name: 'contentStringHtml',
              title: 'routes.admin.post.content',
              formItem: {
                type: 'html',
                rows: 8,
                condition: () => this?.editformat === 'HTML',
              },
            },
            {
              name: 'contentStringBlock',
              title: 'routes.admin.post.content',
              formItem: {
                type: 'markdown',
                rows: 8,
                condition: () => this?.editformat === 'BLOCK',
              },
            },
            {
              name: '',
              title: '',
              formItem: {
                type: 'only-text',
                render: this.titleSeo,
              },
            },
            {
              name: 'seoTitle',
              title: 'routes.admin.post.seoTitle',
              formItem: {},
            },
            {
              name: 'seoKeywords',
              title: 'routes.admin.post.keywords',
              formItem: {},
            },
            {
              name: 'seoDescription',
              title: 'routes.admin.post.description',
              formItem: {
                type: 'textarea',
                rows: 5,
              },
            },
          ],
        },
      },
    ];
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  handelSubmit() {
    const { controls, value, valid } = this.postForm.validateForm;
    const { controls: controlsF, value: valueF, valid: validF } = this.validateForm;
    const { controls: controlsE, value: valueE, valid: validE } = this.extraForm.validateForm;
    const { id } = this.route.snapshot.params;

    if (!valid || !validE || !validF) {
      this.checkControls([controls, controlsE, controlsF]);
      return;
    }
    value.translations.forEach((item: any) => {
      if (item.contentStringBlock && value.editorFormat === 'BLOCK') {
        item.contentString = JSON.stringify(item.contentStringBlock);
        delete item.contentStringBlock;
      }
      if (item.contentStringHtml && value.editorFormat === 'HTML') {
        item.contentString = item.contentStringHtml;
        delete item.contentStringHtml;
      }
    });
    const payload = {
      ...value,
      ...valueE,
      ...valueF,
      isPinned: value.isPinned || false,
      attachments: this.templateUpload.map((item: any) => valueF[item.docType]).filter((item: any) => !!item),
    };

    if (id) {
      this.postsFacade.put(id, payload);
    } else {
      this.postsFacade.post(payload);
    }
  }

  title?: string;

  handleBack() {
    this.title = this.data?.category?.title;
    this.postsFacade.setId(this.route.snapshot.params.id);
    this.postsFacade.query$.pipe(takeUntil(this.destroyed$), take(1)).subscribe((query) => {
      this.router.navigate([this.language + '/post'], {
        relativeTo: this.route,
        queryParams: query || {},
        queryParamsHandling: 'merge',
      });
    });
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

  extraDataColumns: FormModel[] = [
    {
      name: 'backGroundColor',
      title: 'Background Color',
      formItem: {
        type: 'color',
      },
    },
    {
      name: 'titleForeColor',
      title: 'Title Fore Color',
      formItem: {
        type: 'color',
      },
    },
    {
      name: 'isShowTitle',
      title: 'Show Title',
      formItem: {
        type: 'switch',
        col: 6,
      },
    },
    {
      name: 'isPinned',
      title: 'Ghim',
      formItem: {
        type: 'switch',
        col: 6,
      },
    },
    {
      name: 'customCSSClass',
      title: 'Custom Class',
      formItem: {},
    },
    {
      name: 'customCSS',
      title: 'Custom CSS',
      formItem: {
        type: 'textarea',
        rows: 5,
      },
    },
  ];
}
