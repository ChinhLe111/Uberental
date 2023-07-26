import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  TemplateRef,
  ViewEncapsulation,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataTableModel, QueryFilter } from '@model';
import { getSizePageByHeight } from '@utils';

/* eslint-disable  @typescript-eslint/no-non-null-assertion */
@Component({
  selector: 'g-datatable',
  templateUrl: './data-table.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataTableComponent implements OnInit, OnChanges {
  @Input() columns?: DataTableModel[];
  @Input() loading?: boolean | null;
  @Input() large = false;
  @Input() save = true;
  @Input() showPagination = true;
  @Input() showSearch = true;
  @Input() showCheckbox = false;
  @Input() withCheckbox = '30px';
  @Input() showCount = true;
  @Input() showHeader = true;
  @Input() checkboxCondition?: any;
  @Input() checkboxValue = 'id';
  @Input() data?: any[] | undefined = [];
  @Input() total?: number | undefined = 0;
  @Input() size = 1;
  @Input() leftHeader!: TemplateRef<any>;
  @Input() rightHeader!: TemplateRef<any>;
  @Input() renderGrid!: TemplateRef<any>;
  @Input() filterGrid!: TemplateRef<any>;
  @Input() expandTemplate!: TemplateRef<any>;
  @Input() expandRow = false;
  @Input() pageSizeOptions: number[] = [];
  @Input() display = 1;
  @Input() width = '';
  @Input() showLayout = true;
  @Input() alignBetween = true;
  @Input() renderGridTwoColumnMobile = true;
  @Input() heightRow = 40;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Input() classRow = (data: any, extendData: any) => '';
  @Input() extendData: any = {};
  @Output() ngChange = new EventEmitter();
  @Output() ngClickRow = new EventEmitter();
  @Output() idRowUser = new EventEmitter();

  timeOut: any;
  maxLengthCount = 1;
  checked = false;
  indeterminate = false;
  setOfChecked = new Set();
  dataChecked: any[] = [];
  paramTable: {
    page: number;
    size: number;
    filter: any;
    sort: any;
  } = {
    page: 1,
    size: this.size,
    filter: {
      fullTextSearch: '',
    },
    sort: {},
  };
  filterValue = '';
  search?: string;
  expandSet = new Set<number>();

  constructor(private route: ActivatedRoute, private router: Router, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    if (this.save) {
      setTimeout(() => {
        this.route.queryParams.subscribe((queryParams) => {
          if (this.size === 1) this.size = getSizePageByHeight(this.heightRow);
          this.paramTable = {
            page: queryParams.page ? parseInt(queryParams.page, 0) : 1,
            size: queryParams.size ? parseInt(queryParams.size, 0) : this.size,
            filter: queryParams.filter ? JSON.parse(queryParams.filter) : {},
            sort: queryParams.sort ? JSON.parse(queryParams.sort) : {},
          };
        });
        if (this.pageSizeOptions.length === 0) {
          this.pageSizeOptions = [
            this.paramTable.size,
            this.paramTable.size * 2,
            this.paramTable.size * 3,
            this.paramTable.size * 4,
            this.paramTable.size * 5,
          ];
        }
        if (this.paramTable.filter.fullTextSearch) {
          this.search = this.paramTable.filter.fullTextSearch;
        }
        this.changeData();
      });
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.data && changes.data.currentValue) {
      if (changes.data.currentValue.length) {
        this.refreshCheckedStatus();
        this.cdr.detectChanges();
      }
    }
  }

  handleExpandChange(id: number, checked: boolean, isHideExpand: boolean): void {
    if (!isHideExpand) {
      if (checked) {
        this.expandSet.add(id);
      } else {
        this.expandSet.delete(id);
      }
    }
  }

  pickTextColorBasedOnBgColorAdvanced = (bgColor: string, lightColor: string, darkColor: string) => {
    if (!bgColor) {
      return '#1a1b25';
    }
    if (bgColor === 'transparent') {
      return null;
    }
    if (bgColor.length === 4) {
      bgColor = bgColor[1] + bgColor[1] + bgColor[2] + bgColor[2] + bgColor[3] + bgColor[3];
    }
    const color = bgColor.charAt(0) === '#' ? bgColor.substring(1, 7) : bgColor;
    const r = parseInt(color.substring(0, 2), 16);
    const g = parseInt(color.substring(2, 4), 16);
    const b = parseInt(color.substring(4, 6), 16);
    const uicolors = [r / 255, g / 255, b / 255];
    const c = uicolors.map((col) => {
      if (col <= 0.03928) {
        return col / 12.92;
      }
      return Math.pow((col + 0.055) / 1.055, 2.4);
    });
    const L = 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
    return L > 0.4 ? darkColor : lightColor;
  };

  checkActive(column: DataTableModel): boolean {
    if (this.paramTable.filter[column.name]) {
      column.tableItem!.filter!.value = this.paramTable.filter[column.name];
      return true;
    }
    return false;
  }

  changeData(): void {
    this.maxLengthCount = (this.paramTable.page * this.paramTable.size).toString().length;
    const paramRequest: QueryFilter = {
      page: this.paramTable.page,
      size: this.paramTable.size,
      filter: '',
      sort: '',
    };
    paramRequest.filter = JSON.stringify(this.paramTable.filter);
    for (const key in this.paramTable.sort) {
      if (this.paramTable.sort.hasOwnProperty(key)) {
        paramRequest.sort = (this.paramTable.sort[key] === 'ascend' ? '+' : '-') + key;
      }
    }
    this.ngChange.emit(paramRequest);
  }

  compare() {
    return 0;
  }

  sort(data: any, name: string): void {
    if (!this.timeOut) {
      this.timeOut = setTimeout(() => {
        this.paramTable.sort = {};
        if (data) {
          this.paramTable.sort[name] = data;
        }
        this.updateQueryParams();
        this.timeOut = false;
      });
    }
  }

  filter = (data: any, index: number | null, value: any, manyFilter?: any) => {
    if (manyFilter) this.paramTable.filter = manyFilter;
    else this.paramTable.filter[data] = value;
    this.paramTable.page = 1;
    if (index != null && this.columns) {
      this.columns[index].tableItem!.filter!.visible = false;
      this.filterValue = '';
    }
    this.updateQueryParams();
  };

  searchFull(): void {
    if (this.search) {
      this.paramTable.filter.fullTextSearch = this.search;
    } else {
      delete this.paramTable.filter.fullTextSearch;
    }
    this.paramTable.page = 1;
    this.updateQueryParams();
  }

  resetFilter(index: number, name: string): void {
    if (index && this.columns) {
      this.columns[index].tableItem!.filter!.value = '';
      this.columns[index].tableItem!.filter!.visible = false;
    }
    delete this.paramTable.filter[name];
    this.filterValue = '';
    this.updateQueryParams();
  }

  checkFilter(visible: boolean, index: number): void {
    if (!visible && this.columns) {
      const defaultValue = this.paramTable.filter[this.columns[index].name];
      this.columns[index].tableItem!.filter!.value = defaultValue || '';
      this.filterValue = '';
    } else if (this.columns) {
      this.filterValue = this.columns[index].tableItem?.filter?.value || '';
    }
  }

  logFilter(value: any): void {
    this.filterValue = value;
  }

  updateQueryParams(): void {
    const param = JSON.parse(JSON.stringify(this.paramTable));
    param.filter = JSON.stringify(this.paramTable.filter);
    param.sort = JSON.stringify(this.paramTable.sort);
    if (this.save) {
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: param,
        queryParamsHandling: 'merge',
      });
    }
    this.changeData();
  }

  nzQueryParams(data: any): void {
    if (this.paramTable.size !== data.size || this.paramTable.page !== data.page) {
      this.paramTable.size = data.size;
      this.paramTable.page = data.page;
      this.updateQueryParams();
    }
  }

  onAllChecked = (checked: boolean) => {
    if (checked && this.data) {
      this.data
        .filter((item) =>
          !!this.checkboxCondition ? !this.checkboxCondition(item) : !this.setOfChecked.has(item[this.checkboxValue]),
        )
        .forEach((item) => this.updateCheckedSet(item, checked));
    } else {
      this.dataChecked = [];
      this.setOfChecked = new Set();
    }
    this.refreshCheckedStatus();
  };

  updateCheckedSet(item: any, checked: boolean): void {
    if (checked) {
      this.setOfChecked.add(item[this.checkboxValue]);
      this.dataChecked.push(item);
    } else {
      this.setOfChecked.delete(item[this.checkboxValue]);
      this.dataChecked = this.dataChecked.filter((data) => item[this.checkboxValue] !== data[this.checkboxValue]);
    }
  }

  refreshCheckedStatus(): void {
    if (this.data) {
      const listOfEnabledData = this.data.filter((item) =>
        !!this.checkboxCondition ? !this.checkboxCondition(item) : true,
      );
      this.checked = listOfEnabledData.every((item) => this.setOfChecked.has(item[this.checkboxValue]));
      this.indeterminate =
        listOfEnabledData.some((item) => this.setOfChecked.has(item[this.checkboxValue])) && !this.checked;
    }
  }

  onItemChecked(item: any, checked: boolean): void {
    this.updateCheckedSet(item, checked);
    this.refreshCheckedStatus();
  }

  handleChangeDisplay(display: number): void {
    this.display = display;
  }

  handleClickRow(data: any): void {
    if (this.expandRow) {
      this.handleExpandChange(data.id, !this.expandSet.has(data.id), data?.isHideExpand);
    } else {
      this.ngClickRow.emit(data);
    }
    this.idRowUser.emit(data.id);
  }
}
