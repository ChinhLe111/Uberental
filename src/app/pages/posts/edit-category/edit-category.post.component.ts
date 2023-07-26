import { ChangeDetectionStrategy, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup } from '@angular/forms';
import slug from 'slug';
import { PostCategoriesFacade } from '@store';
import { Message, getLanguage } from '@utils';
import { FormModel } from '@model';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-edit-post-category',
  templateUrl: './edit-category.post.component.html',
  providers: [PostCategoriesFacade],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditCategoryPostComponent implements OnInit {
  @ViewChild('upload') postForm!: any;
  id?: string;
  columnsForm: FormModel[] = [];
  language = getLanguage();
  private destroyed$ = new Subject<void>();

  constructor(
    protected message: Message,
    protected route: ActivatedRoute,
    protected router: Router,
    public postCategoriesFacade: PostCategoriesFacade,
  ) {}

  ngOnInit(): void {
    const { id } = this.route.snapshot.params;
    this.id = id;
    if (id) {
      this.postCategoriesFacade.getById(id);
    }
    this.columnsForm = [
      {
        name: 'type',
        title: 'routes.admin.post.type',
        formItem: {
          rules: [{ type: 'required' }],
          value: 'BLOG',
          show: false,
        },
      },
      {
        name: 'title',
        title: 'routes.admin.post.title',
        formItem: {
          rules: [{ type: 'required' }],
          autoSet: (value, formGroup) => {
            const slugInput = formGroup?.get('slug');
            if (value && !slugInput?.value) {
              slugInput?.setValue(slug(value));
            }
          },
        },
      },
      {
        name: 'slug',
        title: 'routes.admin.post.slug',
        formItem: {},
      },
      {
        name: 'coverUrl',
        title: 'routes.admin.post.introduce',
        formItem: {
          type: 'textarea',
          rows: 5,
        },
      },
    ];

    this.postCategoriesFacade.status$.pipe(takeUntil(this.destroyed$)).subscribe((status) => {
      switch (status) {
        case 'postOk':
        case 'putOk':
          this.handleBack();
      }
    });
  }
  handleBack() {
    this.postCategoriesFacade.setId(this.route.snapshot.params.id);
    this.router.navigate([this.language + '/post']);
  }

  handelSubmit(validateForm: FormGroup) {
    const { controls: controlsF, value: valueF, valid: validF } = validateForm;
    const typeDefault = {
      ...valueF,
      type: (valueF.type = 'BLOG'),
    };

    if (!validF) {
      this.checkControls([controlsF]);
      return;
    }

    const { id } = this.route.snapshot.params;
    if (id) {
      this.postCategoriesFacade.put(id, typeDefault);
    } else {
      this.postCategoriesFacade.post(typeDefault);
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
}
