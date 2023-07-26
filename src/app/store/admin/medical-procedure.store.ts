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

import { emptyPagination, Message } from '@utils';
import { Pagination, QueryFilter, RequestApi } from '@model';
import { CodeTypes } from '@store';
// ---------------------------------------------------------------------------------------------------------------------
export const MEDICAL_PROCEDURE_FEATURE_KEY = '40e46926-e333-4816-9769-c6dac77c5244';

const _actions = createActionGroup({
  source: MEDICAL_PROCEDURE_FEATURE_KEY,
  events: {
    get: props<QueryFilter>(),
    'get ok': props<{ pagination: Pagination<MedicalProcedure> }>(),

    getCommission: props<QueryFilter>(),
    'getCommission ok': props<{ commissionList: ProvinceCommission[] }>(),

    putCommission: props<{ ProvinceCommissions: ProvinceCommission[] }>(),
    'putCommission ok': props<{ dataCommission: ProvinceCommission[] }>(),

    getById: props<{ id: string }>(),
    'getById ok': props<{ data: MedicalProcedure }>(),

    post: props<{ data: MedicalProcedure }>(),
    'post ok': props<{ data: MedicalProcedure }>(),

    put: props<{ id: string; data: MedicalProcedure }>(),
    'put ok': props<{ data: MedicalProcedure }>(),

    delete: props<{ id: string }>(),
    'delete ok': emptyProps(),

    setData: emptyProps(),

    'set id': props<{ id: string | null }>(),

    error: emptyProps(),
  },
});
// ---------------------------------------------------------------------------------------------------------------------
const url = `${environment.apiUrl}admin/medical-procedure`;

@Injectable()
export class MedicalProcedureEffects {
  get$ = createEffect(() =>
    this.actions$.pipe(
      ofType(_actions.get),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      exhaustMap(({ type, ...query }) => {
        const params = new HttpParams().appendAll(query);
        return this.httpClient.get<RequestApi<Pagination<MedicalProcedure>>>(`${url}`, { params }).pipe(
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
        this.httpClient.get<RequestApi<MedicalProcedure>>(`${url}/${id}`).pipe(
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
        this.httpClient.post<RequestApi<MedicalProcedure>>(`${url}`, data).pipe(
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
      exhaustMap(({ type, ...query }) =>
        this.httpClient.put<RequestApi<MedicalProcedure>>(`${url}/${query.id}`, query.data).pipe(
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
        this.httpClient.delete<RequestApi<MedicalProcedure>>(`${url}/${id}`).pipe(
          map((res) => {
            this.message.success(res.message);
            return _actions.deleteOk();
          }),
          catchError(async ({ error }) => this.error(error)),
        ),
      ),
    ),
  );
  getCommission$ = createEffect(() =>
    this.actions$.pipe(
      ofType(_actions.getcommission),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      exhaustMap(({ type, ...query }) => {
        const params = new HttpParams().appendAll(query);
        return this.httpClient.get<RequestApi<ProvinceCommission[]>>(`${url}/province-commission`, { params }).pipe(
          map((res) => _actions.getcommissionOk({ commissionList: res.data })),
          catchError(async ({ error }) => this.error(error)),
        );
      }),
    ),
  );
  putCommission$ = createEffect(() =>
    this.actions$.pipe(
      ofType(_actions.putcommission),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      exhaustMap(({ type, ...query }) =>
        this.httpClient.put<RequestApi<ProvinceCommission[]>>(`${url}/province-commission`, query).pipe(
          map((res) => {
            this.message.success(res.message);
            return _actions.putcommissionOk({ dataCommission: res.data });
          }),
          catchError(async ({ error }) => this.error(error)),
        ),
      ),
    ),
  );

  constructor(private actions$: Actions, private httpClient: HttpClient, private message: Message) {}

  error = (error: RequestApi) => {
    if (error.message) this.message.error(error.message);
    return _actions.error();
  };
}

// ---------------------------------------------------------------------------------------------------------------------

export class MedicalProcedure {
  constructor(
    public id: string,
    public name: string,
    public code: string,
    public groupCode: string,
    public levelCode: string,
    public isOneTimeProcedure: boolean,
    public depositPercentage: number,
    public baseCommissionAmount: number,
    public provinceCommissionAmount: number,
    public level?: CodeTypes,
    public group?: CodeTypes,
  ) {}
}

export class ProvinceCommission {
  constructor(public provinceCode: number, public provinceName: string, public commissionPercentage: number) {}
}

export interface MedicalProcedureState {
  pagination: Pagination<MedicalProcedure>;
  data?: MedicalProcedure;
  query?: QueryFilter;
  id: string | null;
  commissionList: ProvinceCommission[];
  isLoading: boolean;
  status:
    | 'idle'
    | 'get'
    | 'getOk'
    | 'getCommission'
    | 'getCommissionOk'
    | 'putCommission'
    | 'putCommissionOk'
    | 'getById'
    | 'getByIdOk'
    | 'post'
    | 'postOk'
    | 'put'
    | 'putOk'
    | 'delete'
    | 'deleteOk'
    | 'setData'
    | 'error';
}

const initialState: MedicalProcedureState = {
  pagination: emptyPagination(),
  data: undefined,
  query: undefined,
  id: null,
  commissionList: [],
  isLoading: false,
  status: 'idle',
};

export const medicalProcedureReducer = createReducer(
  initialState,
  on(_actions.setId, (_state, id) => ({ ..._state, ...id })),

  on(_actions.get, (_state, query) => ({ ..._state, query, isLoading: true, status: 'get' })),
  on(_actions.getOk, (_state, pagination) => ({ ..._state, ...pagination, isLoading: false, status: 'getOk' })),

  on(_actions.getcommissionOk, (_state) => ({ ..._state, isLoading: true, status: 'getCommission' })),
  on(_actions.getcommissionOk, (_state, commissionList) => ({
    ..._state,
    ...commissionList,
    isLoading: false,
    status: 'getCommissionOk',
  })),

  on(_actions.putcommission, (_state) => ({ ..._state, isLoading: true, status: 'putCommission' })),
  on(_actions.putcommissionOk, (_state, dataCommission) => ({
    ..._state,
    ...dataCommission,
    isLoading: false,
    status: 'putCommissionOk',
  })),

  on(_actions.getbyid, (_state) => ({ ..._state, isLoading: true, status: 'getById' })),
  on(_actions.getbyidOk, (_state, data) => ({ ..._state, ...data, isLoading: false, status: 'getByIdOk' })),

  on(_actions.post, (_state) => ({ ..._state, isLoading: true, status: 'post' })),
  on(_actions.postOk, (_state, data) => ({ ..._state, ...data, isLoading: false, status: 'postOk' })),

  on(_actions.put, (_state) => ({ ..._state, isLoading: true, status: 'put' })),
  on(_actions.putOk, (_state, data) => ({ ..._state, ...data, isLoading: false, status: 'putOk' })),

  on(_actions.delete, (_state) => ({ ..._state, isLoading: true, status: 'delete' })),
  on(_actions.deleteOk, (_state) => ({ ..._state, isLoading: false, status: 'deleteOk' })),

  on(_actions.setdata, (_state) => ({ ..._state, data: undefined, isLoading: false, status: 'setData' })),

  on(_actions.error, (_state) => ({ ..._state, isLoading: false, status: 'error' })),
);

// ---------------------------------------------------------------------------------------------------------------------
@Injectable()
export class MedicalProcedureFacade {
  select = createFeatureSelector<MedicalProcedureState>(MEDICAL_PROCEDURE_FEATURE_KEY);
  isLoading$ = this.store.select(createSelector(this.select, (state) => state.isLoading));
  status$ = this.store.select(createSelector(this.select, (state) => state.status));

  constructor(private store: Store) {}

  pagination$ = this.store.select(createSelector(this.select, (state) => state.pagination));
  get = (query: QueryFilter) => this.store.dispatch(_actions.get(query));

  query$ = this.store.select(createSelector(this.select, (state) => state.query));
  id$ = this.store.select(createSelector(this.select, (state) => state.id));
  setId = (id: string | null) => this.store.dispatch(_actions.setId({ id }));

  data$ = this.store.select(createSelector(this.select, (state) => state.data));
  getById = (id: string) => this.store.dispatch(_actions.getbyid({ id }));

  setData = () => this.store.dispatch(_actions.setdata());

  post = (data: MedicalProcedure) => this.store.dispatch(_actions.post({ data }));
  put = (id: string, data: MedicalProcedure) => this.store.dispatch(_actions.put({ id, data }));
  delete = (id: string) => this.store.dispatch(_actions.delete({ id }));

  commissionList$ = this.store.select(createSelector(this.select, (state) => state.commissionList));
  getCommission = (query: QueryFilter) => this.store.dispatch(_actions.getcommission(query));

  putCommission = (ProvinceCommissions: ProvinceCommission[]) =>
    this.store.dispatch(_actions.putcommission({ ProvinceCommissions }));
}
