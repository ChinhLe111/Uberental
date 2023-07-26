import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { DataTableModel } from '@model';
import { DataType, DatasFacade, DataTypesFacade, Datas, GlobalFacade } from '@store';
import { Message, getLanguage } from '@utils';
import { Subject, debounceTime, distinctUntilChanged, take, takeUntil, throttleTime } from 'rxjs';
import { DataTableComponent } from '@core/data-table/data-table.component';

@Component({
  selector: 'app-data',
  templateUrl: './data.component.html',
  providers: [DatasFacade, DataTypesFacade],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataComponent implements OnInit, OnDestroy {
  constructor(
    private globalFacade: GlobalFacade,
    protected message: Message,
    protected route: ActivatedRoute,
    protected router: Router,
    public dataTypesFacade: DataTypesFacade,
    public datasFacade: DatasFacade,
  ) {}

  private destroyed$ = new Subject<void>();
  @ViewChild('tableData') tableData!: DataTableComponent;
  id = '';
  language = getLanguage();

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
    const { filter } = this.route.snapshot.queryParams;
    if (filter) {
      const { type } = JSON.parse(filter);
      if (type) this.selectedDataType = type;
    }
    this.dataTypesFacade.get({ page: 1, size: -1 });
    this.searchDataValueChange();
    this.datasFacade.status$.pipe(takeUntil(this.destroyed$)).subscribe((status) => {
      switch (status) {
        case 'deleteOk':
          this.tableData.changeData();
          break;
      }
    });
    this.dataTypesFacade.status$.pipe(takeUntil(this.destroyed$)).subscribe((status) => {
      switch (status) {
        case 'deleteOk':
          this.dataTypesFacade.get({ page: 1, size: -1 });
          break;
      }
    });
    this.datasFacade.id$.pipe(takeUntil(this.destroyed$), take(1)).subscribe((id) => {
      if (!!id) {
        this.id = id;
        this.datasFacade.setId(null);
      }
    });
    setTimeout(() => {
      this.setTable();
    });
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  classRow(data: Datas, { id }: { id: string }) {
    return data.id === id ? 'bg-blue-100' : '';
  }

  selectedDataType?: string;

  onSelectDataType(type: DataType): void {
    if (this.selectedDataType != type.code) this.selectedDataType = type.code;
    else this.selectedDataType = undefined;
    if (this.tableData) {
      this.tableData.paramTable.filter.type = this.selectedDataType;
      this.tableData.paramTable.page = 1;
      this.tableData.updateQueryParams();
      this.fullTextSearch.setValue('');
    }
  }

  handleDeleteDataType(data: any) {
    this.dataTypesFacade.delete(data.id);
    // this.selectedDataType = undefined;
  }

  fullTextSearch = new FormControl();

  searchDataValueChange() {
    this.fullTextSearch.valueChanges
      .pipe(debounceTime(300), throttleTime(300), distinctUntilChanged(), takeUntil(this.destroyed$))
      .subscribe((value) => {
        if (value) this.tableData.paramTable.filter.fullTextSearch = value;
        else delete this.tableData.paramTable.filter.fullTextSearch;
        this.tableData.paramTable.page = 1;
        this.tableData.updateQueryParams();
      });
  }

  @ViewChild('formLayoutTable') formLayoutTable!: any;
  @ViewChild('titleTemplate') titleTemplate!: any;
  columnsTable: DataTableModel<Datas>[] = [];

  private setTable() {
    this.columnsTable = [
      {
        name: '',
        title: 'routes.admin.Layout.Title',
        tableItem: {
          renderTemplate: this.titleTemplate,
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
              onClick: (item) => this.router.navigate([this.language + '/data', item.id, 'edit']),
            },
            {
              icon: () => 'la-trash',
              textConfirm: () => 'components.data-table.wanttodeletethisrecord',
              text: () => 'routes.admin.Layout.delete',
              color: () => '#dc2626',
              confirm: true,
              onClick: (item) => this.datasFacade.delete(item.id || ''),
            },
          ],
        },
      },
    ];
  }
}
