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

export const WALLET_LIST_FEATURE_KEY = '656ac847-2102-4169-a35f-3be9d3976397';
// ---------------------------------------------------------------------------------------------------------------------
const _actions = createActionGroup({
  source: WALLET_LIST_FEATURE_KEY,
  events: {
    get: props<QueryFilter>(),
    'get ok': props<{ pagination: Pagination<WalletList> }>(),

    getById: props<{ idGetBy: string }>(),
    'getById ok': props<{ data: WalletList }>(),

    putLock: props<{ id: string }>(),
    'putLock ok': emptyProps(),

    putUnlock: props<{ id: string }>(),
    'putUnlock ok': emptyProps(),

    getTransactionsOfWallet: props<{ walletId: string } & QueryFilter>(),
    'getTransactionsOfWallet ok': props<{ transactionsOfWalletPagination: Pagination<TransactionsWalletList> }>(),

    getDepositsOfWallet: props<{ walletId: string } & QueryFilter>(),
    'getDepositsOfWallet ok': props<{ depositsOfWalletPagination: Pagination<DepositsWalletList> }>(),

    'set id': props<{ id: string | null }>(),

    error: emptyProps(),
  },
});
// ---------------------------------------------------------------------------------------------------------------------
const url = `${environment.apiUrl}wallets`;

@Injectable()
export class WalletListEffects {
  get$ = createEffect(() =>
    this.actions$.pipe(
      ofType(_actions.get),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      exhaustMap(({ type, ...query }) => {
        const params = new HttpParams().appendAll(query);
        return this.httpClient.get<RequestApi<Pagination<WalletList>>>(`${url}`, { params }).pipe(
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
      exhaustMap(({ type, idGetBy }) =>
        this.httpClient.get<RequestApi<WalletList>>(`${url}/${idGetBy}`).pipe(
          map((res) => _actions.getbyidOk({ data: res.data })),
          catchError(async ({ error }) => this.error(error)),
        ),
      ),
    ),
  );
  putLock$ = createEffect(() =>
    this.actions$.pipe(
      ofType(_actions.putlock),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      exhaustMap(({ type, id }) =>
        this.httpClient.put<RequestApi>(`${url}/${id}/lock`, '').pipe(
          map((res) => {
            this.message.success(res.message);
            return _actions.putlockOk();
          }),
          catchError(async ({ error }) => this.error(error)),
        ),
      ),
    ),
  );
  putUnlock$ = createEffect(() =>
    this.actions$.pipe(
      ofType(_actions.putunlock),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      exhaustMap(({ type, id }) =>
        this.httpClient.put<RequestApi>(`${url}/${id}/unlock`, '').pipe(
          map((res) => {
            this.message.success(res.message);
            return _actions.putunlockOk();
          }),
          catchError(async ({ error }) => this.error(error)),
        ),
      ),
    ),
  );
  getTransactionsOfWallet$ = createEffect(() =>
    this.actions$.pipe(
      ofType(_actions.gettransactionsofwallet),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      exhaustMap(({ type, walletId, ...query }) => {
        const params = new HttpParams().appendAll(query);
        return this.httpClient
          .get<RequestApi<Pagination<TransactionsWalletList>>>(`${url}/${walletId}/transactions`, { params })
          .pipe(
            map((res) => _actions.gettransactionsofwalletOk({ transactionsOfWalletPagination: res.data })),
            catchError(async ({ error }) => this.error(error)),
          );
      }),
    ),
  );
  getDepositsOfWallet$ = createEffect(() =>
    this.actions$.pipe(
      ofType(_actions.getdepositsofwallet),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      exhaustMap(({ type, walletId, ...query }) => {
        const params = new HttpParams().appendAll(query);
        return this.httpClient
          .get<RequestApi<Pagination<DepositsWalletList>>>(`${url}/${walletId}/deposits`, { params })
          .pipe(
            map((res) => _actions.getdepositsofwalletOk({ depositsOfWalletPagination: res.data })),
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
export class WalletList {
  constructor(
    public id: string,
    public type: string,
    public balance: number,
    public pointBalance: number,
    public owner: string,
    public ownerFullName: string,
    public ownerLevel: number,
    public ownerPhone: string,
    public ownerId: string,
    public locked: boolean,
    public isOwnerLocked: boolean,
    public balanceUnit: string,
    public pointBalanceUnit: string,
  ) {}
}

export interface TransactionsWalletList {
  id: string;
  type: string;
  amount: number;
  createdOnDate: string;
  note: string;
  refOrderNo: string;
  refOrderId: string;
  refPaymentRequestId: string;
  balanceBefore: number;
  balanceAfter: number;
  createdByUserId: string;
}

export interface DepositsWalletList {
  id: string;
  createdByUser: string;
  createdByUserPhone: string;
  createdOnDate: string;
  amount: number;
  transferContent: string;
  status: string;
  isTransferConfirmed: boolean;
  allowedActions: string[];
}

export interface WalletListState {
  pagination: Pagination<WalletList>;
  transactionsOfWalletPagination: Pagination<TransactionsWalletList>;
  depositsOfWalletPagination: Pagination<DepositsWalletList>;
  idGetBy: string | null;
  data?: WalletList;
  query?: QueryFilter;
  id: string | null;
  isLoading: boolean;
  status:
    | 'idle'
    | 'get'
    | 'getOk'
    | 'getById'
    | 'getByIdOk'
    | 'putLock'
    | 'putLockOk'
    | 'putUnlock'
    | 'putUnlockOk'
    | 'getTransactionsOfWallet'
    | 'getTransactionsOfWalletOk'
    | 'getDepositsOfWallet'
    | 'getDepositsOfWalletOk'
    | 'error';
}

const initialState: WalletListState = {
  pagination: emptyPagination(),
  transactionsOfWalletPagination: emptyPagination(),
  depositsOfWalletPagination: emptyPagination(),
  idGetBy: null,
  data: undefined,
  query: undefined,
  id: null,
  isLoading: false,
  status: 'idle',
};

export const walletListReducer = createReducer(
  initialState,
  on(_actions.setId, (_state, id) => ({ ..._state, ...id })),

  on(_actions.get, (_state, query) => ({ ..._state, query, isLoading: true, status: 'get' })),
  on(_actions.getOk, (_state, pagination) => ({ ..._state, ...pagination, isLoading: false, status: 'getOk' })),

  on(_actions.getbyid, (_state, id) => ({ ..._state, ...id, isLoading: true, status: 'getById' })),
  on(_actions.getbyidOk, (_state, data) => ({ ..._state, ...data, isLoading: false, status: 'getByIdOk' })),

  on(_actions.putlock, (_state) => ({ ..._state, isLoading: true, status: 'putLock' })),
  on(_actions.putlockOk, (_state) => ({ ..._state, isLoading: false, status: 'putLockOk' })),

  on(_actions.putunlock, (_state) => ({ ..._state, isLoading: true, status: 'putUnlock' })),
  on(_actions.putunlockOk, (_state) => ({ ..._state, isLoading: false, status: 'putUnlockOk' })),

  on(_actions.gettransactionsofwallet, (_state) => ({ ..._state, isLoading: true, status: 'getTransactionsOfWallet' })),
  on(_actions.gettransactionsofwalletOk, (_state, transactionsOfWalletPagination) => ({
    ..._state,
    ...transactionsOfWalletPagination,
    isLoading: false,
    status: 'getTransactionsOfWalletOk',
  })),

  on(_actions.getdepositsofwallet, (_state) => ({ ..._state, isLoading: true, status: 'getDepositsOfWallet' })),
  on(_actions.getdepositsofwalletOk, (_state, depositsOfWalletPagination) => ({
    ..._state,
    ...depositsOfWalletPagination,
    isLoading: false,
    status: 'getDepositsOfWalletOk',
  })),

  on(_actions.error, (_state) => ({ ..._state, isLoading: false, status: 'error' })),
);

// ---------------------------------------------------------------------------------------------------------------------
@Injectable()
export class WalletListFacade {
  select = createFeatureSelector<WalletListState>(WALLET_LIST_FEATURE_KEY);
  isLoading$ = this.store.select(createSelector(this.select, (state) => state.isLoading));
  status$ = this.store.select(createSelector(this.select, (state) => state.status));

  constructor(private store: Store) {}

  query$ = this.store.select(createSelector(this.select, (state) => state.query));
  id$ = this.store.select(createSelector(this.select, (state) => state.id));
  setId = (id: string | null) => this.store.dispatch(_actions.setId({ id }));

  pagination$ = this.store.select(createSelector(this.select, (state) => state.pagination));
  get = (query: QueryFilter) => this.store.dispatch(_actions.get(query));

  idGetBy$ = this.store.select(createSelector(this.select, (state) => state.idGetBy));
  data$ = this.store.select(createSelector(this.select, (state) => state.data));
  getById = (idGetBy: string) => this.store.dispatch(_actions.getbyid({ idGetBy }));

  transactionsOfWalletPagination$ = this.store.select(
    createSelector(this.select, (state) => state.transactionsOfWalletPagination),
  );
  getTransactionsOfWallet = (walletId: string, query: QueryFilter) =>
    this.store.dispatch(_actions.gettransactionsofwallet({ walletId, ...query }));

  depositsOfWalletPagination$ = this.store.select(
    createSelector(this.select, (state) => state.depositsOfWalletPagination),
  );
  getDepositsOfWallet = (walletId: string, query: QueryFilter) =>
    this.store.dispatch(_actions.getdepositsofwallet({ walletId, ...query }));

  putLock = (id: string) => this.store.dispatch(_actions.putlock({ id }));
  putUnlock = (id: string) => this.store.dispatch(_actions.putunlock({ id }));
}
