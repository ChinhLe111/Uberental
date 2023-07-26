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

export const WALLET_DEPOSITS_FEATURE_KEY = 'd53f1321-1d76-4b74-a21e-476009f11db5';
// ---------------------------------------------------------------------------------------------------------------------
const _actions = createActionGroup({
  source: WALLET_DEPOSITS_FEATURE_KEY,
  events: {
    get: props<QueryFilter>(),
    'get ok': props<{ pagination: Pagination<WalletDeposits> }>(),

    getById: props<{ id: string }>(),
    'getById ok': props<{ data: WalletDeposits }>(),

    putCancel: props<{ id: string; cancelReason: string }>(),
    'putCancel ok': emptyProps(),

    putConfirmReceived: props<{ id: string; listMessageId?: string[] }>(),
    'putConfirmReceived ok': emptyProps(),

    putConfirmTransferred: props<{ id: string }>(),
    'putConfirmTransferred ok': emptyProps(),

    error: emptyProps(),
  },
});
// ---------------------------------------------------------------------------------------------------------------------
const url = `${environment.apiUrl}wallet/deposits`;

@Injectable()
export class WalletDepositsEffects {
  get$ = createEffect(() =>
    this.actions$.pipe(
      ofType(_actions.get),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      exhaustMap(({ type, ...query }) => {
        const params = new HttpParams().appendAll(query);
        return this.httpClient.get<RequestApi<Pagination<WalletDeposits>>>(`${url}`, { params }).pipe(
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
        this.httpClient.get<RequestApi<WalletDeposits>>(`${url}/${id}`).pipe(
          map((res) => _actions.getbyidOk({ data: res.data })),
          catchError(async ({ error }) => this.error(error)),
        ),
      ),
    ),
  );
  putCancel$ = createEffect(() =>
    this.actions$.pipe(
      ofType(_actions.putcancel),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      exhaustMap(({ type, id, cancelReason }) =>
        this.httpClient.put<RequestApi<WalletDeposits>>(`${url}/${id}/cancel`, { cancelReason: cancelReason }).pipe(
          map((res) => {
            this.message.success(res.message);
            return _actions.putcancelOk();
          }),
          catchError(async ({ error }) => this.error(error)),
        ),
      ),
    ),
  );
  putConfirmReceived$ = createEffect(() =>
    this.actions$.pipe(
      ofType(_actions.putconfirmreceived),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      exhaustMap(({ type, id, listMessageId }) =>
        this.httpClient
          .put<RequestApi<WalletDeposits>>(`${url}/${id}/confirm-received`, { listMessageId: listMessageId })
          .pipe(
            map((res) => {
              this.message.success(res.message);
              return _actions.putconfirmreceivedOk();
            }),
            catchError(async ({ error }) => this.error(error)),
          ),
      ),
    ),
  );
  putConfirmTransferred$ = createEffect(() =>
    this.actions$.pipe(
      ofType(_actions.putconfirmtransferred),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      exhaustMap(({ type, id }) =>
        this.httpClient.put<RequestApi<WalletDeposits>>(`${url}/${id}/confirm-transferred`, {}).pipe(
          map((res) => {
            this.message.success(res.message);
            return _actions.putconfirmtransferredOk();
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

export class WalletDeposits {
  constructor(
    public bankAccountNumber: string,
    public bankName: string,
    public bankAccountName: string,
    public transferConfirmedDate: string,
    public imageUrl: string,
    public isReceived: boolean,
    public receivedDate: string,
    public receivalConfirmedBy: string,
    public cancelReason: string,
    public id: string,
    public createdByUser: string,
    public createdByUserPhone: string,
    public createdOnDate: string,
    public amount: number,
    public transferContent: string,
    public status: string,
    public isTransferConfirmed: boolean,
    public allowedActions: string[],
  ) {}
}

export interface WalletDepositsState {
  pagination: Pagination<WalletDeposits>;
  data?: WalletDeposits;
  isLoading: boolean;
  status:
    | 'idle'
    | 'get'
    | 'getOk'
    | 'getById'
    | 'getByIdOk'
    | 'putCancel'
    | 'putCancelOk'
    | 'putConfirmReceived'
    | 'putConfirmReceivedOk'
    | 'putConfirmTransferred'
    | 'putConfirmTransferredOk'
    | 'error';
}

const initialState: WalletDepositsState = {
  pagination: emptyPagination(),
  data: undefined,
  isLoading: false,
  status: 'idle',
};

export const walletDepositsReducer = createReducer(
  initialState,
  on(_actions.get, (_state) => ({ ..._state, isLoading: true, status: 'get' })),
  on(_actions.getOk, (_state, pagination) => ({ ..._state, ...pagination, isLoading: false, status: 'getOk' })),

  on(_actions.getbyid, (_state) => ({ ..._state, isLoading: true, status: 'getById' })),
  on(_actions.getbyidOk, (_state, data) => ({ ..._state, ...data, isLoading: false, status: 'getByIdOk' })),

  on(_actions.putcancel, (_state) => ({ ..._state, isLoading: true, status: 'putCancel' })),
  on(_actions.putcancelOk, (_state) => ({ ..._state, isLoading: false, status: 'putCancelOk' })),

  on(_actions.putconfirmreceived, (_state) => ({ ..._state, isLoading: true, status: 'putConfirmReceived' })),
  on(_actions.putconfirmreceivedOk, (_state) => ({ ..._state, isLoading: false, status: 'putConfirmReceivedOk' })),

  on(_actions.putconfirmtransferred, (_state) => ({ ..._state, isLoading: true, status: 'putConfirmTransferred' })),
  on(_actions.putconfirmtransferredOk, (_state) => ({
    ..._state,
    isLoading: false,
    status: 'putConfirmTransferredOk',
  })),

  on(_actions.error, (_state) => ({ ..._state, isLoading: false, status: 'error' })),
);

// ---------------------------------------------------------------------------------------------------------------------
@Injectable()
export class WalletDepositsFacade {
  select = createFeatureSelector<WalletDepositsState>(WALLET_DEPOSITS_FEATURE_KEY);
  isLoading$ = this.store.select(createSelector(this.select, (state) => state.isLoading));
  status$ = this.store.select(createSelector(this.select, (state) => state.status));

  constructor(private store: Store) {}

  pagination$ = this.store.select(createSelector(this.select, (state) => state.pagination));
  get = (query: QueryFilter) => this.store.dispatch(_actions.get(query));

  data$ = this.store.select(createSelector(this.select, (state) => state.data));
  getById = (id: string) => this.store.dispatch(_actions.getbyid({ id }));

  putCancel = (id: string, cancelReason: string) => this.store.dispatch(_actions.putcancel({ id, cancelReason }));
  putConfirmReceived = (id: string, listMessageId: string[]) =>
    this.store.dispatch(
      _actions.putconfirmreceived({
        id,
        listMessageId,
      }),
    );
  putConfirmTransferred = (id: string) => this.store.dispatch(_actions.putconfirmtransferred({ id }));
}
