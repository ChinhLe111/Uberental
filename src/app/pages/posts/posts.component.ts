import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, takeUntil, throttleTime, Subject, withLatestFrom, take } from 'rxjs';

import { Message, getLanguage } from '@utils';
import { PostsFacade, PostCategoriesFacade, PostCategories, Posts, GlobalFacade } from '@store';
import { Router, ActivatedRoute } from '@angular/router';
import { EditPostComponent } from '@src/app/pages/posts/edit/edit.post.component';
import { DataTableModel } from '@model';
import { DataTableComponent } from '@core/data-table/data-table.component';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  providers: [PostsFacade, PostCategoriesFacade, EditPostComponent],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostsComponent implements OnInit, OnDestroy {
  @ViewChild('titleTemplate') titleTemplate!: any;
  @ViewChild('table') table!: DataTableComponent;
  private destroyed$ = new Subject<void>();
  columnsTable: DataTableModel<Posts>[] = [];
  id?: string = '';
  language = getLanguage();

  constructor(
    public globalFacade: GlobalFacade,
    protected message: Message,
    protected router: Router,
    protected route: ActivatedRoute,
    public postsFacade: PostsFacade,
    public postCategoriesFacade: PostCategoriesFacade,
  ) {}

  ngOnInit() {
    this.globalFacade.setBreadcrumbs([
      {
        title: 'QUẢN LÝ DANH MỤC',
        link: '/navigation',
      },
      {
        title: 'Post',
        link: '/post',
      },
    ]);
    this.postCategoriesFacade.get({ page: 1, size: -1 });

    this.searchPostValueChange();
    this.postsFacade.status$.pipe(takeUntil(this.destroyed$)).subscribe((status) => {
      switch (status) {
        case 'putStatusOk':
        case 'deleteOk':
          this.table.changeData();
          break;
      }
    });

    this.postCategoriesFacade.id$.pipe(takeUntil(this.destroyed$)).subscribe((id) => {
      if (!!id) {
        this.id = id;
        this.postCategoriesFacade.setId(null);
      }
    });
    this.postCategoriesFacade.list$
      .pipe(takeUntil(this.destroyed$), withLatestFrom(this.postsFacade.query$), take(2))
      .subscribe(([list, query]) => {
        if (query?.filter) {
          const filter = JSON.parse(query?.filter);
          if (filter.categoryId && this.id) {
            this.selectedCategory = list.filter((item) => item.id === filter.categoryId)[0];
          }
        }
      });
    this.postsFacade.id$.pipe(takeUntil(this.destroyed$), take(1)).subscribe((id) => {
      if (!!id) {
        this.id = id;
        this.postsFacade.setId(null);
      }
    });

    this.postCategoriesFacade.status$.pipe(takeUntil(this.destroyed$)).subscribe((status) => {
      switch (status) {
        case 'postOk':
          this.postCategoriesFacade.get({});
          break;
        case 'putOk':
          this.postCategoriesFacade.get({});
          break;
        case 'deleteOk':
          this.postCategoriesFacade.get({});
          break;
      }
    });
    setTimeout(() => {
      this.columnsTable = [
        {
          name: 'title',
          title: 'routes.admin.post.title',
          tableItem: {
            renderTemplate: this.titleTemplate,
          },
        },
        {
          name: '',
          title: 'routes.admin.Layout.action',
          tableItem: {
            width: '105px',
            align: 'center',
            actions: [
              {
                color: (item) => (item?.publishStatus == 'PUBLISHED' ? '#C0C0C0' : '#40A9FF'),
                icon: (item) => (item?.publishStatus == 'PUBLISHED' ? 'la-ban' : 'la-globe'),
                text: (item) =>
                  item?.publishStatus == 'PUBLISHED' ? 'routes.admin.post.Hide' : 'routes.admin.post.public',
                confirm: true,
                onClick: (item) =>
                  this.postsFacade.putStatus(
                    item.id || '',
                    item.publishStatus === 'PUBLISHED' ? 'APPROVED' : 'PUBLISHED',
                  ),
              },
              {
                icon: () => 'la-edit',
                text: () => 'routes.admin.Layout.edit',
                color: () => '#40A9FF',
                onClick: (item) => this.router.navigate([this.language + '/post', item.id, 'edit']),
                condition: (item) => item?.publishStatus != 'PUBLISHED',
              },
              {
                icon: () => 'la-trash',
                textConfirm: () => 'components.data-table.wanttodeletethisrecord',
                text: () => 'routes.admin.Layout.delete',
                color: () => '#ec3737',
                confirm: true,
                onClick: (item) => this.postsFacade.delete(item.id || ''),
                condition: (item) => item?.publishStatus != 'PUBLISHED',
              },
              // {
              //   icon: () => 'la-eye',
              //   color: () => '#10A67E',
              //   text: () => 'routes.admin.post.viewpost',
              //   condition: (item) => item?.publishStatus == 'PUBLISHED',
              // },
            ],
          },
        },
      ];
    });
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  selectedCategory?: PostCategories;

  onSelectCategory(item: PostCategories): void {
    this.selectedCategory && this.selectedCategory.id === item.id
      ? (this.selectedCategory = undefined)
      : (this.selectedCategory = item);
    if (!this.fullTextSearch.value) {
      if (this.selectedCategory?.id) this.table.paramTable.filter.categoryId = this.selectedCategory?.id;
      else delete this.table.paramTable.filter.categoryId;
      this.table.paramTable.page = 1;
      this.table.updateQueryParams();
    } else {
      this.fullTextSearch.setValue('');
    }
  }

  classRow(data: Posts, { id }: { id: string }) {
    return data.id === id ? 'bg-blue-100' : '';
  }

  classRowCategory(data: PostCategories, { id }: { id: string }) {
    return data.id === id ? 'bg-blue-100' : '';
  }

  handleDeleteCategory(data: any) {
    this.postCategoriesFacade.delete(data.id);
    this.selectedCategory = undefined;
  }

  fullTextSearch = new FormControl();

  searchPostValueChange() {
    this.fullTextSearch.valueChanges
      .pipe(debounceTime(300), throttleTime(300), distinctUntilChanged(), takeUntil(this.destroyed$))
      .subscribe((value) => {
        if (value) this.table.paramTable.filter.fullTextSearch = value;
        else delete this.table.paramTable.filter.fullTextSearch;
        this.table.paramTable.page = 1;
        this.table.updateQueryParams();
      });
  }
}
