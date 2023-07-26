import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewEncapsulation,
} from '@angular/core';

@Component({
  selector: 'g-pagination',
  templateUrl: './pagination.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginationComponent implements OnInit, OnChanges {
  @Input() pageSizeOptions: number[] = [];
  @Input() total?: number = 4;
  @Input() size = 10;
  @Input() page = 1;
  @Input() showSizeChanger = true;
  @Input() showTotal = true;
  @Output() readonly pageIndexChange = new EventEmitter<number>();
  @Output() readonly pageSizeChange = new EventEmitter<number>();
  @Output() readonly queryParams = new EventEmitter();
  ranges: number[] = [];
  listOfPageItem: any[] = [];

  ngOnInit(): void {
    this.buildIndexes();
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { page, size, total } = changes;
    if (page || size || total) {
      this.ranges = [(this.page - 1) * this.size + 1, Math.min(this.page * this.size, this.total || 0)];
      this.buildIndexes();
    }
  }

  buildIndexes(): void {
    const lastIndex = this.getLastIndex(this.total || 0, this.size);
    this.listOfPageItem = this.getListOfPageItem(this.page, lastIndex);
  }

  onPageIndexChange(index: number): void {
    this.page = index;
    this.pageIndexChange.emit(index);
    this.queryParams.emit({
      size: this.size,
      page: this.page,
    });
  }

  onPageSizeChange(size: number): void {
    this.pageSizeChange.emit(size);
    this.pageIndexChange.emit(1);
    this.queryParams.emit({
      size: size,
      page: 1,
    });
  }

  getLastIndex(total: number, size: number): number {
    return Math.ceil(total / size);
  }

  getListOfPageItem(page: number, lastIndex: number): Array<any> {
    const concatWithPrevNext = (listOfPage: Array<any>) => {
      const prevItem = {
        type: 'prev',
        disabled: page === 1,
      };
      const nextItem = {
        type: 'next',
        disabled: page === lastIndex,
      };
      return [prevItem, ...listOfPage, nextItem];
    };
    const generatePage = (start: number, end: number): Array<any> => {
      const list = [];
      for (let i = start; i <= end; i++) {
        list.push({
          index: i,
          type: 'page',
        });
      }
      return list;
    };
    if (lastIndex <= 9) {
      return concatWithPrevNext(generatePage(1, lastIndex));
    } else {
      const generateRangeItem = (selected: number, last: number) => {
        let listOfRange = [];
        const prevFiveItem = {
          type: 'prev_5',
        };
        const nextFiveItem = {
          type: 'next_5',
        };
        const firstPageItem = generatePage(1, 1);
        const lastPageItem = generatePage(lastIndex, lastIndex);
        if (selected < 4) {
          listOfRange = [...generatePage(2, 5), nextFiveItem];
        } else if (selected < last - 3) {
          listOfRange = [prevFiveItem, ...generatePage(selected - 2, selected + 2), nextFiveItem];
        } else {
          listOfRange = [prevFiveItem, ...generatePage(last - 4, last - 1)];
        }
        return [...firstPageItem, ...listOfRange, ...lastPageItem];
      };
      return concatWithPrevNext(generateRangeItem(page, lastIndex));
    }
  }
}
