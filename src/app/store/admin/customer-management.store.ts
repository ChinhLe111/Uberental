import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  Store,
  createActionGroup,
  createFeatureSelector,
  createReducer,
  createSelector,
  emptyProps,
  on,
  props,
} from '@ngrx/store';
import { catchError, exhaustMap, map } from 'rxjs';

import { Pagination, QueryFilter, RequestApi } from '@model';
import { environment } from '@src/environments/environment';
import { Message, emptyPagination } from '@utils';

export const CUSTOMER_MANAGEMENT_FUTURE_KEY = 'f0cb94a0-ed56-4e7c-b6a4-5e04b2fa9e41';
// ---------------------------------------------------------------------------------------------------------------------
const _actions = createActionGroup({
  source: CUSTOMER_MANAGEMENT_FUTURE_KEY,
  events: {
    get: props<QueryFilter>(),
    'get ok': props<{ pagination: Pagination<Customer> }>(),

    getById: props<{ id: string }>(),
    'getById ok': props<{ data: Customer }>(),

    delete: props<{ id: string }>(),
    'delete ok': emptyProps(),

    error: emptyProps(),
  },
});
// ---------------------------------------------------------------------------------------------------------------------
const url = `${environment.apiUrl}medical-info`;
@Injectable()
export class CustomerEffects {
 
  get$ = createEffect(() =>
  this.actions$.pipe(
    ofType(_actions.get),
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    exhaustMap(({ type, ...query }) => {
      const params = new HttpParams().appendAll(query);
      return this.httpClient.get<RequestApi<Pagination<Customer>>>(`${url}`, { params }).pipe(
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
        this.httpClient.get<RequestApi<Customer>>(`${url}/${id}`).pipe(
          map((res) => {
            return _actions.getbyidOk({ data: res.data });
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
      exhaustMap(({ type, ...query }) => {
        return this.httpClient.delete<RequestApi<Customer>>(`${url}/${query.id}`).pipe(
          map((res) => {
            this.message.success(res.message);
            return _actions.deleteOk();
          }),
          catchError(async ({ error }) => this.error(error)),
        );
      }),
    ),
  );

  constructor(private actions$: Actions, private message: Message, private httpClient: HttpClient) {}
  error = (error: RequestApi) => {
    if (error.message) this.message.error(error.message);
    return _actions.error();
  };
}

// ---------------------------------------------------------------------------------------------------------------------
export class Customer {
  constructor(
    public id?: string,
    public customerName?: string,
    public birthday?: string,
    public cccd?: string,
    public gender?: string,
    public address?: string,
    public createByUserId?: string,
    public lastModifiedByUserId?: string,
    public lastModifiedOnDate?: string,
    public createdOnDate?: string,
    public createByUserName?: string,
    public lastModifiedByUserName?: string,
  ) {}
}

export interface Customer {
  customerName?: string;
  birthday?: string;
  cccd?: string;
  gender?: string;
  address?: string;
  // createdOnDate?: string,
}
export interface CustomerState {
  pagination: Pagination<Customer>;
  query?: QueryFilter;
  isLoading: boolean;
  listCustomer: Customer[];
  status: 'idle' 
  | 'get' 
  | 'getOk' 
  | 'getById'
  | 'getByIdOk'
  | 'delete' 
  | 'deleteOk'
  | 'error';
}

const initialState: CustomerState = {
  pagination: emptyPagination(),
  query: undefined,
  listCustomer: [],
  isLoading: false,
  status: 'idle',
};

export const customerReducer = createReducer(
  initialState,
  on(_actions.get, (_state, query) => ({ ..._state, isLoading: true, status: 'get', query })),

  on(_actions.getOk, (_state, pagination) => ({ ..._state, ...pagination, isLoading: false, status: 'getOk' })),

  on(_actions.getbyid, (_state) => ({ ..._state, isLoading: true, status: 'getById' })),
  on(_actions.getbyidOk, (_state, data) => ({
    ..._state,
    ...data,
    isLoading: false,
    status: 'getByIdOk',
  })),

  on(_actions.delete, (_state) => ({ ..._state, isLoading: true, status: 'delete' })),
  on(_actions.deleteOk, (_state) => ({
    ..._state,
    isLoading: false,
    status: 'deleteOk',
  })),

  on(_actions.error, (_state) => ({ ..._state, isLoading: false, status: 'error' })),
);

// ---------------------------------------------------------------------------------------------------------------------
@Injectable()
export class CustomerFacade {
  select = createFeatureSelector<CustomerState>(CUSTOMER_MANAGEMENT_FUTURE_KEY);
  isLoading$ = this.store.select(createSelector(this.select, (state) => state.isLoading));
  status$ = this.store.select(createSelector(this.select, (state) => state.status));
  getList = (query: QueryFilter) => this.store.dispatch(_actions.get(query));
  query$ = this.store.select(createSelector(this.select, (state) => state.query));

  constructor(private store: Store) {}
  pagination$ = this.store.select(createSelector(this.select, (state) => state.pagination));
  delete = (id: string) => this.store.dispatch(_actions.delete({ id }));
}
