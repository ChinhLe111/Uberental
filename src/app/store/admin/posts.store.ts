import {
  createActionGroup,
  createFeatureSelector,
  createReducer,
  createSelector,
  emptyProps,
  on,
  props,
  Store,
} from '@ngrx/store';
import { environment } from '@src/environments/environment';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, map } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Pagination, QueryFilter, RequestApi } from '@model';
import { emptyPagination, Message } from '@utils';
import { Attachment, Editor, PostCategories } from '@store';

export const POSTS_FEATURE_KEY = '5b6be830-1b8d-4ce5-89cd-ccb57a63f5f7';

// ---------------------------------------------------------------------------------------------------------------------
const _actions = createActionGroup({
  source: POSTS_FEATURE_KEY,
  events: {
    get: props<QueryFilter>(),
    'get ok': props<{ pagination: Pagination<Posts> }>(),

    getById: props<{ id: string }>(),
    'getById ok': props<{ data: Posts }>(),

    post: props<{ data: Posts }>(),
    'post ok': props<{ data: Posts }>(),

    put: props<{ id: string; data: Posts }>(),
    'put ok': props<{ data: Posts }>(),

    delete: props<{ id: string }>(),
    'delete ok': props<{ data: Posts }>(),

    putStatus: props<{ id: string; status: 'APPROVED' | 'PUBLISHED' }>(),
    'putStatus ok': emptyProps(),

    'set id': props<{ id: string | null }>(),
    'set isLoading': props<{ isLoading: boolean }>(),
    error: emptyProps(),
  },
});

// ---------------------------------------------------------------------------------------------------------------------
const url = `${environment.apiUrl}admin/posts`;
@Injectable()
export class PostsEffects {
  get$ = createEffect(() =>
    this.actions$.pipe(
      ofType(_actions.get),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      exhaustMap(({ type, ...query }) => {
        const params = new HttpParams().appendAll(query);
        return this.httpClient.get<RequestApi<Pagination<Posts>>>(`${url}`, { params }).pipe(
          map((res) => _actions.getOk({ pagination: res.data })),
          catchError(async ({ error }) => this.error(error)),
        );
      }),
    ),
  );
  getById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(_actions.getbyid),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      exhaustMap(({ type, id }) =>
        this.httpClient.get<RequestApi<Posts>>(`${url}/${id}`).pipe(
          map((res) => {
            return _actions.getbyidOk({ data: res.data });
          }),
          catchError(async ({ error }) => this.error(error)),
        ),
      ),
    ),
  );
  post$ = createEffect(() =>
    this.actions$.pipe(
      ofType(_actions.post),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      exhaustMap(({ type, data }) =>
        this.httpClient.post<RequestApi<Posts>>(`${url}`, data).pipe(
          map((res) => {
            this.message.success(res.message);
            return _actions.postOk({ data: res.data });
          }),
          catchError(async ({ error }) => this.error(error)),
        ),
      ),
    ),
  );
  put$ = createEffect(() =>
    this.actions$.pipe(
      ofType(_actions.put),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      exhaustMap(({ type, id, data }) =>
        this.httpClient.put<RequestApi<Posts>>(`${url}/${id}`, data).pipe(
          map((res) => {
            this.message.success(res.message);
            return _actions.putOk({ data: res.data });
          }),
          catchError(async ({ error }) => this.error(error)),
        ),
      ),
    ),
  );
  delete$ = createEffect(() =>
    this.actions$.pipe(
      ofType(_actions.delete),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      exhaustMap(({ type, id }) =>
        this.httpClient.delete<RequestApi<Posts>>(`${url}/${id}`).pipe(
          map((res) => {
            this.message.success(res.message);
            return _actions.deleteOk({ data: res.data });
          }),
          catchError(async ({ error }) => this.error(error)),
        ),
      ),
    ),
  );
  putStatus$ = createEffect(() =>
    this.actions$.pipe(
      ofType(_actions.putstatus),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      exhaustMap(({ type, id, status }) =>
        this.httpClient.put<RequestApi>(`${url}/${id}/publish/${status}`, {}).pipe(
          map((res) => {
            this.message.success(res.message);
            return _actions.putstatusOk();
          }),
          catchError(async ({ error }) => this.error(error)),
        ),
      ),
    ),
  );
  constructor(private actions$: Actions, private message: Message, private httpClient: HttpClient) {}
  error = (error: RequestApi) => {
    if (error.message) this.message.error(error.message);
    return _actions.error();
  };
}

// ---------------------------------------------------------------------------------------------------------------------
export class Posts {
  constructor(
    public id?: string,
    public title?: string,
    public publishStatus?: string,
    public thumbnailUrl?: string,
    public coverUrl?: string,
    public editorFormat?: string,
    public isPinned?: boolean,
    public category?: PostCategories,
    public createdOnDate?: string,
    public partnerId?: string,
    public relatedPostListId?: string[],
    public translations?: {
      title?: string;
      unaccentTitle?: string;
      slug?: string;
      summary?: string;
      contentString?: Editor;
      language?: string;
      seoDescription?: string;
      seoKeywords?: string;
    }[],
    public attachments?: Attachment[],
  ) {}
}

export interface PostsState {
  pagination: Pagination<Posts>;
  query?: QueryFilter;
  data?: Posts;
  isLoading: boolean;
  id: string | null;
  status:
    | 'idle'
    | 'get'
    | 'getOk'
    | 'getById'
    | 'setIsloading'
    | 'getByIdOk'
    | 'post'
    | 'postOk'
    | 'put'
    | 'putOk'
    | 'delete'
    | 'deleteOk'
    | 'putStatus'
    | 'putStatusOk'
    | 'setId'
    | 'error';
}

const initialState: PostsState = {
  pagination: emptyPagination(),
  data: undefined,
  isLoading: false,
  status: 'idle',
  query: undefined,
  id: null,
};

export const postsReducer = createReducer(
  initialState,
  on(_actions.setId, (_state, data) => ({ ..._state, ...data, status: 'setId' })),
  on(_actions.setIsloading, (_state, data) => ({ ..._state, ...data, status: 'setIsloading' })),
  on(_actions.get, (_state, query) => ({ ..._state, isLoading: true, status: 'get', query })),

  on(_actions.getOk, (_state, pagination) => ({ ..._state, ...pagination, isLoading: false, status: 'getOk' })),

  on(_actions.getbyid, (_state) => ({ ..._state, isLoading: true, status: 'getById' })),
  on(_actions.getbyidOk, (_state, data) => ({
    ..._state,
    ...data,
    isLoading: false,
    status: 'getByIdOk',
  })),

  on(_actions.post, (_state) => ({ ..._state, isLoading: true, status: 'post' })),
  on(_actions.postOk, (_state, data) => ({
    ..._state,
    ...data,
    isLoading: false,
    status: 'postOk',
  })),

  on(_actions.put, (_state) => ({ ..._state, isLoading: true, status: 'put' })),
  on(_actions.putOk, (_state, data) => ({
    ..._state,
    ...data,
    isLoading: false,
    status: 'putOk',
  })),

  on(_actions.delete, (_state) => ({ ..._state, isLoading: true, status: 'delete' })),
  on(_actions.deleteOk, (_state, data) => ({
    ..._state,
    ...data,
    isLoading: false,
    status: 'deleteOk',
  })),

  on(_actions.putstatus, (_state) => ({ ..._state, isLoading: true, status: 'putStatus' })),
  on(_actions.putstatusOk, (_state) => ({
    ..._state,
    isLoading: false,
    status: 'putStatusOk',
  })),
  on(_actions.error, (_state) => ({ ..._state, isLoading: false, status: 'error' })),
);

// ---------------------------------------------------------------------------------------------------------------------
@Injectable()
export class PostsFacade {
  select = createFeatureSelector<PostsState>(POSTS_FEATURE_KEY);
  status$ = this.store.select(createSelector(this.select, (state) => state.status));

  constructor(private store: Store) {}
  isLoading$ = this.store.select(createSelector(this.select, (state) => state.isLoading));
  setIsLoading = (isLoading: boolean) => this.store.dispatch(_actions.setIsloading({ isLoading }));

  pagination$ = this.store.select(createSelector(this.select, (state) => state.pagination));
  query$ = this.store.select(createSelector(this.select, (state) => state.query));
  get = (query: QueryFilter) => this.store.dispatch(_actions.get(query));

  data$ = this.store.select(createSelector(this.select, (state) => state.data));
  getById = (id: string) => this.store.dispatch(_actions.getbyid({ id }));
  post = (data: PostCategories) => this.store.dispatch(_actions.post({ data }));
  id$ = this.store.select(createSelector(this.select, (state) => state.id));
  setId = (id: string | null) => this.store.dispatch(_actions.setId({ id }));

  put = (id: string, data: PostCategories) => this.store.dispatch(_actions.put({ id, data }));
  putStatus = (id: string, status: 'APPROVED' | 'PUBLISHED') => this.store.dispatch(_actions.putstatus({ id, status }));
  delete = (id: string) => this.store.dispatch(_actions.delete({ id }));
}
