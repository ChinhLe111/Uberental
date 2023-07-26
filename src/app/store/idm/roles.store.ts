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

import { environment } from '@src/environments/environment';
import { Pagination, QueryFilter, RequestApi } from '@model';
import { emptyPagination, Message } from '@utils';

export const ROLE_FEATURE_KEY = '34467748-75fa-427b-981e-a4f9f86ba465';
// ---------------------------------------------------------------------------------------------------------------------
const _actions = createActionGroup({
  source: ROLE_FEATURE_KEY,
  events: {
    get: props<QueryFilter>(),
    'get ok': props<{ pagination: Pagination<Role> }>(),

    getRolesInternal: props<QueryFilter>(),
    'getRolesInternal ok': props<{ roles: Role[] }>(),

    getRolesCustomer: props<QueryFilter>(),
    'getRolesCustomer ok': props<{ roles: Role[] }>(),

    error: emptyProps(),
  },
});
// ---------------------------------------------------------------------------------------------------------------------
const url = `${environment.apiUrl}idm/roles`;
@Injectable()
export class RoleEffects {
  get$ = createEffect(() =>
    this.actions$.pipe(
      ofType(_actions.get),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      exhaustMap(({ type, ...query }) => {
        const params = new HttpParams().appendAll(query);
        return this.httpClient.get<RequestApi<Pagination<Role>>>(`${url}`, { params }).pipe(
          map((res) => _actions.getOk({ pagination: res.data })),
          catchError(async ({ error }) => this.error(error)),
        );
      }),
    ),
  );

  getRolesCustomer$ = createEffect(() =>
    this.actions$.pipe(
      ofType(_actions.getrolescustomer),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      exhaustMap(({ type, ...query }) => {
        const params = new HttpParams().appendAll(query);
        return this.httpClient.get<RequestApi<Pagination<Role>>>(`${url}/customer`, { params }).pipe(
          map((res) =>
            _actions.getrolescustomerOk({
              roles: res.data.content.map((item) => ({ ...item, value: item.code, label: item.name })),
            }),
          ),
          catchError(async ({ error }) => this.error(error)),
        );
      }),
    ),
  );

  getRolesInternal$ = createEffect(() =>
    this.actions$.pipe(
      ofType(_actions.getrolesinternal),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      exhaustMap(({ type, ...query }) => {
        const params = new HttpParams().appendAll(query);
        return this.httpClient.get<RequestApi<Pagination<Role>>>(`${url}/employee`, { params }).pipe(
          map((res) =>
            _actions.getrolesinternalOk({
              roles: res.data.content.map((item) => ({ ...item, value: item.code, label: item.name })),
            }),
          ),
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
export interface Role {
  description: string;
  id: string;
  code: string;
  name: string;
  isSystem: boolean;
  level: number;
  value: string;
  label: string;
}

export interface RoleState {
  pagination: Pagination<Role>;
  isLoading: boolean;
  roles: Role[];
  status:
    | 'idle'
    | 'get'
    | 'getOk'
    | 'getRolesInternal'
    | 'getRolesInternalOK'
    | 'getRolesCustomer'
    | 'getRolesCustomerOK'
    | 'error';
}

const initialState: RoleState = {
  pagination: emptyPagination(),
  roles: [],
  isLoading: false,
  status: 'idle',
};

export const roleReducer = createReducer(
  initialState,
  on(_actions.get, (_state) => ({ ..._state, isLoading: true, status: 'get' })),
  on(_actions.getOk, (_state, pagination) => ({
    ..._state,
    ...pagination,
    isLoading: false,
    status: 'getOk',
  })),

  on(_actions.getrolesinternal, (_state) => ({ ..._state, isLoading: true, status: 'getRolesInternal' })),
  on(_actions.getrolesinternalOk, (_state, roles) => ({
    ..._state,
    ...roles,
    isLoading: false,
    status: 'getRolesInternalOK',
  })),

  on(_actions.getrolescustomer, (_state) => ({ ..._state, isLoading: true, status: 'getRolesCustomer' })),
  on(_actions.getrolescustomerOk, (_state, roles) => ({
    ..._state,
    ...roles,
    isLoading: false,
    status: 'getRolesCustomerOK',
  })),

  on(_actions.error, (_state) => ({ ..._state, isLoading: false, status: 'error' })),
);

// ---------------------------------------------------------------------------------------------------------------------
@Injectable()
export class RoleFacade {
  select = createFeatureSelector<RoleState>(ROLE_FEATURE_KEY);
  isLoading$ = this.store.select(createSelector(this.select, (state) => state.isLoading));
  status$ = this.store.select(createSelector(this.select, (state) => state.status));

  constructor(private store: Store) {}

  pagination$ = this.store.select(createSelector(this.select, (state) => state.pagination));
  get = (query: QueryFilter) => this.store.dispatch(_actions.get(query));

  rolesInternal$ = this.store.select(createSelector(this.select, (state) => state.roles));
  rolesInternal = (query: QueryFilter) => this.store.dispatch(_actions.getrolesinternal(query));

  rolesCustomer$ = this.store.select(createSelector(this.select, (state) => state.roles));
  rolesCustomer = (query: QueryFilter) => this.store.dispatch(_actions.getrolescustomer(query));
}
