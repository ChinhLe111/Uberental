import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { DataTableModel } from '@model';
import { CodeTypes, CodeTypesFacade, GlobalFacade, TypesCodeTypeFacade } from '@store';
import { Message, getLanguage } from '@utils';
import { Subject, debounceTime, distinctUntilChanged, take, takeUntil, throttleTime } from 'rxjs';
import { DataTableComponent } from '@core/data-table/data-table.component';

@Component({
  selector: 'app-code-type',
  templateUrl: './code-type.component.html',
  providers: [CodeTypesFacade, TypesCodeTypeFacade],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CodeTypesComponent implements OnInit {
  constructor(
    public globalFacade: GlobalFacade,
    protected message: Message,
    private cdr: ChangeDetectorRef,
    protected route: ActivatedRoute,
    protected router: Router,
    public codeTypesFacade: CodeTypesFacade,
    public typesFacade: TypesCodeTypeFacade,
  ) {}

  private destroyed$ = new Subject<void>();
  public selectedType?: string;
  id?: string = '';
  language = getLanguage();

  ngOnInit() {
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
    this.typesFacade.get({});
    this.searchDataValueChange();
    this.codeTypesFacade.status$.pipe(takeUntil(this.destroyed$)).subscribe((status) => {
      switch (status) {
        case 'deleteOk':
          this.tableCodeType.changeData();
          break;
      }
    });
    this.selectedType = JSON.parse(this.route.snapshot.queryParams.filter).type;
    this.codeTypesFacade.id$.pipe(takeUntil(this.destroyed$), take(1)).subscribe((id) => {
      if (!!id) {
        this.id = id;
        this.codeTypesFacade.setId(null);
      }
    });
    this.table();
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  classRow(data: CodeTypes, { id }: { id: string }) {
    return data.id === id ? 'bg-blue-100' : '';
  }

  @ViewChild('tableCodeType') tableCodeType!: DataTableComponent;

  public onSelectType(type: string): void {
    this.selectedType = type;
    if (this.tableCodeType) {
      this.tableCodeType.paramTable.filter.type = type;
      this.tableCodeType.paramTable.page = 1;
      this.tableCodeType.updateQueryParams();
      this.fullTextSearch.setValue('');
    }
  }

  fullTextSearch = new FormControl();

  searchDataValueChange() {
    this.fullTextSearch.valueChanges
      .pipe(debounceTime(300), throttleTime(300), distinctUntilChanged(), takeUntil(this.destroyed$))
      .subscribe((value) => {
        if (value) this.tableCodeType.paramTable.filter.fullTextSearch = value;
        else delete this.tableCodeType.paramTable.filter.fullTextSearch;
        this.tableCodeType.paramTable.page = 1;
        this.tableCodeType.updateQueryParams();
      });
  }

  @ViewChild('formLayoutTable') formLayoutTable!: any;
  @ViewChild('titleTemplate') titleTemplate!: any;

  columnsTable: DataTableModel<CodeTypes>[] = [];

  private table() {
    setTimeout(() => {
      this.columnsTable = [
        {
          name: '',
          title: 'routes.admin.Layout.Title',
          tableItem: {
            renderTemplate: this.titleTemplate,
          },
        },
        {
          name: 'code',
          title: 'routes.admin.Layout.Code',
          tableItem: {
            width: '150px',
          },
        },
        {
          name: 'order',
          title: 'routes.admin.Layout.Order',
          tableItem: {
            width: '80px',
            sort: null,
          },
        },
        {
          name: '',
          title: 'routes.admin.Layout.action',
          tableItem: {
            width: '85px',
            align: 'center',
            actions: [
              {
                icon: () => 'la-edit',
                text: () => 'routes.admin.Layout.edit',
                color: () => '#40A9FF',
                onClick: (item) => this.router.navigate([this.language + '/code-types', item.type, item.id, 'edit']),
              },
              {
                icon: () => 'la-trash',
                textConfirm: () => 'components.data-table.wanttodeletethisrecord',
                text: () => 'routes.admin.Layout.delete',
                color: () => '#dc2626',
                confirm: true,
                onClick: (item) => this.codeTypesFacade.delete(item.id),
              },
            ],
          },
        },
      ];
    });
  }
}
