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
import { Reasons } from '@store';

export const ESCROW_WITHDRAWAL_LIST_FEATURE_KEY = 'b06ee19f-c7a5-44e9-9b67-7a01c367315b';
// ---------------------------------------------------------------------------------------------------------------------
const _actions = createActionGroup({
  source: ESCROW_WITHDRAWAL_LIST_FEATURE_KEY,
  events: {
    get: props<QueryFilter>(),
    'get ok': props<{ pagination: Pagination<EscrowWithdrawalList> }>(),

    'set id': props<{ id: string | null }>(),

    getById: props<{ id: string }>(),
    'getById ok': props<{ data: EscrowWithdrawalList }>(),

    delete: props<{ id: string }>(),
    'delete ok': props<{ data: EscrowWithdrawalList }>(),

    approve: props<{ id: string }>(),
    'approve ok': props<{ data: EscrowWithdrawalList }>(),

    reject: props<{ id: string; rejectReason: string }>(),
    'reject ok': props<{ data: EscrowWithdrawalList }>(),

    cancel: props<{ id: string }>(),
    'cancel ok': props<{ data: EscrowWithdrawalList }>(),

    getReasons: emptyProps(),
    'getReasons ok': props<{ reasonsList: Reasons[] }>(),

    error: emptyProps(),
  },
});
// ---------------------------------------------------------------------------------------------------------------------
const url = `${environment.apiUrl}platform-deposit-withdrawal`;

@Injectable()
export class EscrowWithdrawalListEffects {
  get$ = createEffect(() =>
    this.actions$.pipe(
      ofType(_actions.get),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      exhaustMap(({ type, ...query }) => {
        const params = new HttpParams().appendAll(query);
        return this.httpClient.get<RequestApi<Pagination<EscrowWithdrawalList>>>(`${url}`, { params }).pipe(
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
        this.httpClient.get<RequestApi<EscrowWithdrawalList>>(`${url}/${id}`).pipe(
          map((res) => _actions.getbyidOk({ data: res.data })),
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
        this.httpClient.delete<RequestApi<EscrowWithdrawalList>>(`${url}/${id}`).pipe(
          map((res) => {
            this.message.success(res.message);
            return _actions.deleteOk({ data: res.data });
          }),
          catchError(async ({ error }) => this.error(error)),
        ),
      ),
    ),
  );
  approve$ = createEffect(() =>
    this.actions$.pipe(
      ofType(_actions.approve),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      exhaustMap(({ type, id }) =>
        this.httpClient.put<RequestApi<EscrowWithdrawalList>>(`${url}/${id}/approve`, {}).pipe(
          map((res) => {
            this.message.success(res.message);
            return _actions.approveOk({ data: res.data });
          }),
          catchError(async ({ error }) => this.error(error)),
        ),
      ),
    ),
  );
  reject$ = createEffect(() =>
    this.actions$.pipe(
      ofType(_actions.reject),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      exhaustMap(({ type, id, rejectReason }) =>
        this.httpClient
          .put<RequestApi<EscrowWithdrawalList>>(`${url}/${id}/reject`, { rejectReason: rejectReason })
          .pipe(
            map((res) => {
              this.message.success(res.message);
              return _actions.rejectOk({ data: res.data });
            }),
            catchError(async ({ error }) => this.error(error)),
          ),
      ),
    ),
  );
  cancel$ = createEffect(() =>
    this.actions$.pipe(
      ofType(_actions.cancel),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      exhaustMap(({ type, id }) =>
        this.httpClient.put<RequestApi<EscrowWithdrawalList>>(`${url}/${id}/cancel`, {}).pipe(
          map((res) => {
            this.message.success(res.message);
            return _actions.cancelOk({ data: res.data });
          }),
          catchError(async ({ error }) => this.error(error)),
        ),
      ),
    ),
  );
  getReasons$ = createEffect(() =>
    this.actions$.pipe(
      ofType(_actions.getreasons),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      exhaustMap(({ type }) => {
        return this.httpClient.get<RequestApi<Reasons[]>>(`${environment.apiUrl}config/reject-withdrawal-reasons`).pipe(
          map((res) => _actions.getreasonsOk({ reasonsList: res.data })),
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
export class EscrowWithdrawalList {
  constructor(
    public id: string,
    public ownerId: string,
    public depositTotal: number,
    public withdrawalAmount: number,
    public statusCode: string,
    public approvedOnDate: string,
    public approvedByUserId: string,
    public approvedByUserName: string,
    public approvedByName: string,
    public rejectedOnDate: string,
    public rejectedByUserId: string,
    public rejectedByUserName: string,
    public rejectedByName: string,
    public withdrawalReason: string,
    public rejectReason: string,
    public walletTransactionId: string,
    public createdByUserId: string,
    public createdByUserName: string,
    public createdByName: string,
    public createdOnDate: string,
    public lastModifiedByUserId: string,
    public lastModifiedOnDate: string,
    public profileTypeCode: string,
    public farmerId: string,
    public farmerName: string,
    public code: string,
    public medicalDegreeCode: string,
    public medicalDegree: {
      title: string;
      code: string;
    },
  ) {}
}

export interface EscrowWithdrawalListState {
  pagination: Pagination<EscrowWithdrawalList>;
  data?: EscrowWithdrawalList;
  reasonsList?: Reasons[];
  query?: QueryFilter;
  id: string | null;
  isLoading: boolean;
  status:
    | 'idle'
    | 'get'
    | 'getOk'
    | 'getById'
    | 'getByIdOk'
    | 'delete'
    | 'deleteOk'
    | 'approve'
    | 'approveOk'
    | 'reject'
    | 'rejectOk'
    | 'cancel'
    | 'cancelOk'
    | 'getReasons'
    | 'getReasonsOk'
    | 'setId'
    | 'error';
}

const initialState: EscrowWithdrawalListState = {
  pagination: emptyPagination(),
  data: undefined,
  reasonsList: undefined,
  query: undefined,
  id: null,
  isLoading: false,
  status: 'idle',
};

export const escrowWithdrawalListReducer = createReducer(
  initialState,
  on(_actions.setId, (_state, id) => ({ ..._state, ...id, status: 'setId' })),

  on(_actions.get, (_state, query) => ({ ..._state, query, isLoading: true, status: 'get' })),
  on(_actions.getOk, (_state, pagination) => ({ ..._state, ...pagination, isLoading: false, status: 'getOk' })),

  on(_actions.getbyid, (_state) => ({ ..._state, isLoading: true, status: 'getById' })),
  on(_actions.getbyidOk, (_state, data) => ({ ..._state, ...data, isLoading: false, status: 'getByIdOk' })),

  on(_actions.delete, (_state) => ({ ..._state, isLoading: true, status: 'delete' })),
  on(_actions.deleteOk, (_state, data) => ({ ..._state, ...data, isLoading: false, status: 'deleteOk' })),

  on(_actions.approve, (_state) => ({ ..._state, isLoading: true, status: 'approve' })),
  on(_actions.approveOk, (_state, data) => ({ ..._state, ...data, isLoading: false, status: 'approveOk' })),

  on(_actions.reject, (_state) => ({ ..._state, isLoading: true, status: 'reject' })),
  on(_actions.rejectOk, (_state, data) => ({ ..._state, ...data, isLoading: false, status: 'rejectOk' })),

  on(_actions.cancel, (_state) => ({ ..._state, isLoading: true, status: 'cancel' })),
  on(_actions.cancelOk, (_state, data) => ({ ..._state, ...data, isLoading: false, status: 'cancelOk' })),

  on(_actions.getreasons, (_state) => ({ ..._state, isLoading: true, status: 'getReasons' })),
  on(_actions.getreasonsOk, (_state, data) => ({ ..._state, ...data, isLoading: false, status: 'getReasonsOk' })),

  on(_actions.error, (_state) => ({ ..._state, isLoading: false, status: 'error' })),
);

// ---------------------------------------------------------------------------------------------------------------------
@Injectable()
export class EscrowWithdrawalListFacade {
  select = createFeatureSelector<EscrowWithdrawalListState>(ESCROW_WITHDRAWAL_LIST_FEATURE_KEY);
  isLoading$ = this.store.select(createSelector(this.select, (state) => state.isLoading));
  status$ = this.store.select(createSelector(this.select, (state) => state.status));

  constructor(private store: Store) {}

  pagination$ = this.store.select(
    createSelector(this.select, (state) => {
      const filterData = state.pagination.content.filter((data) => data.statusCode != 'DRAFT');
      return { ...state.pagination, content: filterData };
    }),
  );
  get = (query: QueryFilter) => this.store.dispatch(_actions.get(query));

  query$ = this.store.select(createSelector(this.select, (state) => state.query));
  id$ = this.store.select(createSelector(this.select, (state) => state.id));
  setId = (id: string | null) => this.store.dispatch(_actions.setId({ id }));

  data$ = this.store.select(createSelector(this.select, (state) => state.data));
  getById = (id: string) => this.store.dispatch(_actions.getbyid({ id }));
  delete = (id: string) => this.store.dispatch(_actions.delete({ id }));
  approve = (id: string) => this.store.dispatch(_actions.approve({ id }));
  reject = (id: string, rejectReason: string) => this.store.dispatch(_actions.reject({ id, rejectReason }));
  cancel = (id: string) => this.store.dispatch(_actions.cancel({ id }));

  reasonsList$ = this.store.select(createSelector(this.select, (state) => state.reasonsList));
  getReasons = () => this.store.dispatch(_actions.getreasons());
}
