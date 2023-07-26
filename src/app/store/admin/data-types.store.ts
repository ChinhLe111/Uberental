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
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, map } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Pagination, QueryFilter, RequestApi } from '@model';
import { emptyPagination, Message } from '@utils';
import { environment } from '@src/environments/environment';

export const DATA_TYPES_FEATURE_KEY = '8122da59-9520-4b21-b2a4-97b973c43ebf';

// ---------------------------------------------------------------------------------------------------------------------
const _actions = createActionGroup({
  source: DATA_TYPES_FEATURE_KEY,
  events: {
    get: props<QueryFilter>(),
    'get ok': props<{ pagination: Pagination<DataType> }>(),

    getById: props<{ id: string }>(),
    'getById ok': props<{ data: DataType }>(),

    post: props<{ data: DataType }>(),
    'post ok': props<{ data: DataType }>(),

    put: props<{ id: string; data: DataType }>(),
    'put ok': props<{ data: DataType }>(),

    delete: props<{ id: string }>(),
    'delete ok': props<{ data: DataType }>(),

    'set id': props<{ id: string | null }>(),

    error: emptyProps(),
  },
});

// ---------------------------------------------------------------------------------------------------------------------
const url = `${environment.apiUrl}admin/datatype`;
@Injectable()
export class DataTypesEffects {
  get$ = createEffect(() =>
    this.actions$.pipe(
      ofType(_actions.get),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      exhaustMap(({ type, ...query }) => {
        const params = new HttpParams().appendAll(query);
        return this.httpClient.get<RequestApi<Pagination<DataType>>>(`${url}`, { params }).pipe(
          map((res) =>
            _actions.getOk({
              pagination: {
                ...res.data,
                content: res.data.content.map((item) => ({ ...item, value: item.code, label: item.name })),
              },
            }),
          ),
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
        this.httpClient.get<RequestApi<DataType>>(`${url}/${id}`).pipe(
          map((res) => _actions.getbyidOk({ data: res.data })),
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
        this.httpClient.post<RequestApi<DataType>>(`${url}`, data).pipe(
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
        this.httpClient.put<RequestApi<DataType>>(`${url}/${id}`, data).pipe(
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
        this.httpClient.delete<RequestApi<DataType>>(`${url}/${id}`).pipe(
          map((res) => {
            this.message.success(res.message);
            return _actions.deleteOk({ data: res.data });
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
export class DataType {
  constructor(
    public id: string,
    public name: string,
    public value: string,
    public label: string,
    public code: string,
    public order: number,
    public isPrimary: boolean,
    public createOnDate: string,
  ) {}
}

export interface DataTypesState {
  pagination: Pagination<DataType>;
  data?: DataType;
  query?: QueryFilter;
  id: string | null;
  isLoading: boolean;
  status:
    | 'idle'
    | 'get'
    | 'getOk'
    | 'getById'
    | 'getDataByIdOk'
    | 'post'
    | 'postOk'
    | 'put'
    | 'putOk'
    | 'delete'
    | 'deleteOk'
    | 'setId'
    | 'error';
}

const initialState: DataTypesState = {
  pagination: emptyPagination(),
  data: undefined,
  query: undefined,
  id: null,
  isLoading: false,
  status: 'idle',
};

export const dataTypesReducer = createReducer(
  initialState,
  on(_actions.setId, (_state, data) => ({ ..._state, ...data, status: 'setId' })),
  on(_actions.get, (_state, query) => ({ ..._state, isLoading: true, status: 'get', query })),
  on(_actions.getOk, (_state, pagination) => ({ ..._state, ...pagination, isLoading: false, status: 'getOk' })),

  on(_actions.getbyid, (_state) => ({ ..._state, isLoading: true, status: 'getById' })),
  on(_actions.getbyidOk, (_state, data) => ({ ..._state, ...data, isLoading: false, status: 'getDataByIdOk' })),

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
  on(_actions.error, (_state) => ({ ..._state, isLoading: false, status: 'error' })),
);

// ---------------------------------------------------------------------------------------------------------------------
@Injectable()
export class DataTypesFacade {
  select = createFeatureSelector<DataTypesState>(DATA_TYPES_FEATURE_KEY);
  isLoading$ = this.store.select(createSelector(this.select, (state) => state.isLoading));
  status$ = this.store.select(createSelector(this.select, (state) => state.status));

  constructor(private store: Store) {}

  pagination$ = this.store.select(createSelector(this.select, (state) => state.pagination));
  query$ = this.store.select(createSelector(this.select, (state) => state.query));
  list$ = this.store.select(createSelector(this.select, (state) => state.pagination.content));
  get = (query: QueryFilter) => this.store.dispatch(_actions.get(query));

  data$ = this.store.select(createSelector(this.select, (state) => state.data));
  getById = (id: string) => this.store.dispatch(_actions.getbyid({ id }));
  post = (data: DataType) => this.store.dispatch(_actions.post({ data }));

  put = (id: string, data: DataType) => this.store.dispatch(_actions.put({ id, data }));
  delete = (id: string) => this.store.dispatch(_actions.delete({ id }));

  id$ = this.store.select(createSelector(this.select, (state) => state.id));
  setId = (id: string | null) => this.store.dispatch(_actions.setId({ id }));
}
