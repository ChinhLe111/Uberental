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

export const CODE_TYPES_FEATURE_KEY = '32a0c2fb-b356-4500-b967-9fa0ae5d10ca';

// ---------------------------------------------------------------------------------------------------------------------
const _actions = createActionGroup({
  source: CODE_TYPES_FEATURE_KEY,
  events: {
    get: props<QueryFilter>(),
    'get ok': props<{ pagination: Pagination<CodeTypes> }>(),

    getById: props<{ id: string }>(),
    'getById ok': props<{ data: CodeTypes }>(),

    post: props<{ data: CodeTypes }>(),
    'post ok': props<{ data: CodeTypes }>(),

    put: props<{ id: string; data: CodeTypes }>(),
    'put ok': props<{ data: CodeTypes }>(),

    delete: props<{ id: string }>(),
    'delete ok': props<{ data: CodeTypes }>(),

    getEscrowMoney: props<QueryFilter>(),
    'getEscrowMoney ok': props<{ paginationEscrowMoney: Pagination<EscrowMoney> }>(),

    putEscrowMoney: props<{ escrowMoneyList: EscrowMoney[] }>(),
    'putEscrowMoney ok': props<{ escrowMoneyList: EscrowMoney[] }>(),

    'set id': props<{ id: string | null }>(),
    error: emptyProps(),
  },
});
// ---------------------------------------------------------------------------------------------------------------------
const url = `${environment.apiUrl}admin/code-types`;

@Injectable()
export class CodeTypesEffects {
  get$ = createEffect(() =>
    this.actions$.pipe(
      ofType(_actions.get),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      exhaustMap(({ type, ...query }) => {
        const params = new HttpParams().appendAll(query);
        return this.httpClient.get<RequestApi<Pagination<CodeTypes>>>(`${url}`, { params }).pipe(
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
        this.httpClient.get<RequestApi<CodeTypes>>(`${url}/${id}`).pipe(
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
        this.httpClient.post<RequestApi<CodeTypes>>(`${url}`, data).pipe(
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
        this.httpClient.put<RequestApi<CodeTypes>>(`${url}/${id}`, data).pipe(
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
        this.httpClient.delete<RequestApi<CodeTypes>>(`${url}/${id}`).pipe(
          map((res) => {
            this.message.success(res.message);
            return _actions.deleteOk({ data: res.data });
          }),
          catchError(async ({ error }) => this.error(error)),
        ),
      ),
    ),
  );
  getEscrowMoney$ = createEffect(() =>
    this.actions$.pipe(
      ofType(_actions.getescrowmoney),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      exhaustMap(({ type, ...query }) => {
        const params = new HttpParams().appendAll(query);
        return this.httpClient
          .get<RequestApi<Pagination<EscrowMoney>>>(`${environment.apiUrl}config/minimum-platform-deposit-amounts`, {
            params,
          })
          .pipe(
            map((res) => _actions.getescrowmoneyOk({ paginationEscrowMoney: res.data })),
            catchError(async ({ error }) => this.error(error)),
          );
      }),
    ),
  );
  putEscrowMoney$ = createEffect(() =>
    this.actions$.pipe(
      ofType(_actions.putescrowmoney),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      exhaustMap(({ type, escrowMoneyList }) =>
        this.httpClient
          .put<RequestApi<EscrowMoney[]>>(
            `${environment.apiUrl}config/minimum-platform-deposit-amounts`,
            escrowMoneyList,
          )
          .pipe(
            map((res) => {
              this.message.success(res.message);
              return _actions.putescrowmoneyOk({ escrowMoneyList: res.data });
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

export class CodeTypes {
  constructor(
    public title: string,
    public id: string,
    public code: string,
    public order: number,
    public description: string,
    public type: string,
    public translations: {
      title: string;
      description: string;
      language: string;
    },
  ) {}
}

export interface EscrowMoney {
  medicalDegreeCode: string;
  medicalDegree: string;
  minimumDepositAmount: number;
}

export interface CodeTypesState {
  pagination: Pagination<CodeTypes>;
  data?: CodeTypes;
  query?: QueryFilter;
  id: string | null;
  paginationEscrowMoney: Pagination<EscrowMoney>;
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
    | 'getEscrowMoney'
    | 'getEscrowMoneyOk'
    | 'putEscrowMoney'
    | 'putEscrowMoneyOk'
    | 'setId'
    | 'error';
}

const initialState: CodeTypesState = {
  pagination: emptyPagination(),
  data: undefined,
  query: undefined,
  id: null,
  paginationEscrowMoney: emptyPagination(),
  isLoading: false,
  status: 'idle',
};

export const codeTypesReducer = createReducer(
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

  on(_actions.getescrowmoney, (_state) => ({ ..._state, isLoading: true, status: 'getEscrowMoney' })),
  on(_actions.getescrowmoneyOk, (_state, paginationEscrowMoney) => ({
    ..._state,
    ...paginationEscrowMoney,
    isLoading: false,
    status: 'getEscrowMoneyOk',
  })),

  on(_actions.putescrowmoney, (_state) => ({ ..._state, isLoading: true, status: 'putEscrowMoney' })),
  on(_actions.putescrowmoneyOk, (_state) => ({
    ..._state,
    isLoading: false,
    status: 'putEscrowMoneyOk',
  })),

  on(_actions.error, (_state) => ({ ..._state, isLoading: false, status: 'error' })),
);

// ---------------------------------------------------------------------------------------------------------------------
@Injectable()
export class CodeTypesFacade {
  select = createFeatureSelector<CodeTypesState>(CODE_TYPES_FEATURE_KEY);
  isLoading$ = this.store.select(createSelector(this.select, (state) => state.isLoading));
  status$ = this.store.select(createSelector(this.select, (state) => state.status));

  constructor(private store: Store) {}

  pagination$ = this.store.select(createSelector(this.select, (state) => state.pagination));
  query$ = this.store.select(createSelector(this.select, (state) => state.query));
  get = (query: QueryFilter) => this.store.dispatch(_actions.get(query));

  data$ = this.store.select(createSelector(this.select, (state) => state.data));
  getById = (id: string) => this.store.dispatch(_actions.getbyid({ id }));

  post = (data: CodeTypes) => this.store.dispatch(_actions.post({ data }));
  put = (id: string, data: CodeTypes) => this.store.dispatch(_actions.put({ id, data }));
  delete = (id: string) => this.store.dispatch(_actions.delete({ id }));

  id$ = this.store.select(createSelector(this.select, (state) => state.id));
  setId = (id: string | null) => this.store.dispatch(_actions.setId({ id }));

  paginationEscrowMoney$ = this.store.select(createSelector(this.select, (state) => state.paginationEscrowMoney));
  getEscrowMoney = (query: QueryFilter) => this.store.dispatch(_actions.getescrowmoney(query));

  putEscrowMoney = (escrowMoneyList: EscrowMoney[]) =>
    this.store.dispatch(_actions.putescrowmoney({ escrowMoneyList }));
}
