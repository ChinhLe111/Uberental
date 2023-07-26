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

export const WALLET_SMS_FEATURE_KEY = '6c69bab6-0551-4e45-b88a-dfae8b151c27';
// ---------------------------------------------------------------------------------------------------------------------
const _actions = createActionGroup({
  source: WALLET_SMS_FEATURE_KEY,
  events: {
    get: props<QueryFilter>(),
    'get ok': props<{ pagination: Pagination<WalletSms> }>(),

    getById: props<{ id: string }>(),
    'getById ok': props<{ data: WalletSms }>(),

    error: emptyProps(),
  },
});
// ---------------------------------------------------------------------------------------------------------------------
const url = `${environment.apiUrl}wallets/balance-messages`;

@Injectable()
export class WalletSmsEffects {
  get$ = createEffect(() =>
    this.actions$.pipe(
      ofType(_actions.get),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      exhaustMap(({ type, ...query }) => {
        const params = new HttpParams().appendAll(query);
        return this.httpClient.get<RequestApi<Pagination<WalletSms>>>(`${url}`, { params }).pipe(
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
        this.httpClient.get<RequestApi<WalletSms>>(`${url}/${id}`).pipe(
          map((res) => _actions.getbyidOk({ data: res.data })),
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

export class WalletSms {
  constructor(
    public id: string,
    public content: string,
    public transferContent: string,
    public amount: number,
    public phoneNumber: string,
    public matched: boolean,
  ) {}
}

export interface WalletSmsState {
  pagination: Pagination<WalletSms>;
  data?: WalletSms;
  isLoading: boolean;
  status: 'idle' | 'get' | 'getOk' | 'getById' | 'getByIdOk' | 'error';
}

const initialState: WalletSmsState = {
  pagination: emptyPagination(),
  data: undefined,
  isLoading: false,
  status: 'idle',
};

export const walletSmsReducer = createReducer(
  initialState,
  on(_actions.get, (_state) => ({ ..._state, isLoading: true, status: 'get' })),
  on(_actions.getOk, (_state, pagination) => ({ ..._state, ...pagination, isLoading: false, status: 'getOk' })),

  on(_actions.getbyid, (_state) => ({ ..._state, isLoading: true, status: 'getById' })),
  on(_actions.getbyidOk, (_state, data) => ({ ..._state, ...data, isLoading: false, status: 'getByIdOk' })),

  on(_actions.error, (_state) => ({ ..._state, isLoading: false, status: 'error' })),
);

// ---------------------------------------------------------------------------------------------------------------------
@Injectable()
export class WalletSmsFacade {
  select = createFeatureSelector<WalletSmsState>(WALLET_SMS_FEATURE_KEY);
  isLoading$ = this.store.select(createSelector(this.select, (state) => state.isLoading));
  status$ = this.store.select(createSelector(this.select, (state) => state.status));

  constructor(private store: Store) {}

  pagination$ = this.store.select(createSelector(this.select, (state) => state.pagination));
  get = (query: QueryFilter) => this.store.dispatch(_actions.get(query));

  data$ = this.store.select(createSelector(this.select, (state) => state.data));
  getById = (id: string) => this.store.dispatch(_actions.getbyid({ id }));
}
