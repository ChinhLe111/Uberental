import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, take, takeUntil } from 'rxjs';

import { FormModel } from '@model';
import { CodeTypesFacade, GlobalFacade, TypesCodeTypeFacade } from '@store';
import { getLanguage } from '@utils';

@Component({
  selector: 'app-create-edit',
  templateUrl: './edit.code-type.component.html',
  providers: [CodeTypesFacade, TypesCodeTypeFacade],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditCodeTypeComponent implements OnInit, OnDestroy {
  constructor(
    protected route: ActivatedRoute,
    public codeTypesFacade: CodeTypesFacade,
    public typesFacade: TypesCodeTypeFacade,
    protected router: Router,
    public globalFacade: GlobalFacade,
  ) {}

  private destroyed$ = new Subject<void>();
  id = '';
  type = '';
  language = getLanguage();

  ngOnInit() {
    this.id = this.route.snapshot.params.id;
    this.globalFacade.setBreadcrumbs([
      {
        title: 'QUẢN LÝ DANH MỤC',
        link: '/code-types',
      },
      {
        title: 'Danh mục',
        link: '/code-types',
      },
    ]);
    if (this.id) {
      this.codeTypesFacade.getById(this.id);
    } else this.codeTypesFacade.setId(null);

    this.type = this.route.snapshot.params.type;
    this.typesFacade.get({});
    this.columnsForm = [
      {
        name: 'title',
        title: 'routes.admin.Layout.Title',
        formItem: {
          col: 6,
          rules: [{ type: 'required' }],
        },
      },
      {
        name: 'order',
        title: 'routes.admin.Layout.Order',
        formItem: {
          col: 3,
          type: 'number',
        },
      },
      {
        name: 'code',
        title: 'routes.admin.Layout.Code',
        formItem: {
          col: 3,
          readonly: !!this.id,
          rules: [{ type: 'required' }],
        },
      },
      {
        name: 'description',
        title: 'routes.admin.Layout.Description',
        formItem: {
          type: 'textarea',
        },
      },
    ];
    this.codeTypesFacade.status$.pipe(takeUntil(this.destroyed$)).subscribe((status) => {
      switch (status) {
        case 'putOk':
        case 'postOk':
          this.handleBack();
          break;
      }
    });
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  handelSubmit(validateForm: FormGroup) {
    const { value, valid } = validateForm;
    if (valid) {
      const data = {
        ...value,
        order: value.order === null ? 0 : value.order,
        type: this.type,
      };
      if (this.id) this.codeTypesFacade.put(this.id, data);
      else this.codeTypesFacade.post(data);
    }
  }

  handleBack() {
    this.codeTypesFacade.setId(this.route.snapshot.params.id);
    this.checkQuery();
  }

  checkQuery = () => {
    this.codeTypesFacade.query$.pipe(take(1)).subscribe((query) => {
      if (query) {
        const newSort: { [key: string]: string } = {};
        if (query.sort) {
          const arrSort = query.sort.split(/(?<=[+-])/);
          newSort[arrSort[1]] = arrSort[0] == '+' ? 'ascend' : 'descend';
        }

        this.router.navigate([this.language + '/code-types'], {
          relativeTo: this.route,
          queryParams: { ...query, sort: JSON.stringify(newSort) },
          queryParamsHandling: 'merge',
        });
      } else
        this.router.navigate([this.language + '/code-types'], {
          relativeTo: this.route,
          queryParams: {
            filter: JSON.stringify({ type: this.type }),
          },
          queryParamsHandling: 'merge',
        });
    });
  };

  columnsForm: FormModel[] = [];
}
