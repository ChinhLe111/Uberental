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

export const TYPES_CODE_TYPE_FEATURE_KEY = '40be0279-3b58-4dd6-a2e0-952ffb7cc25a';

// ---------------------------------------------------------------------------------------------------------------------
const _actions = createActionGroup({
  source: TYPES_CODE_TYPE_FEATURE_KEY,
  events: {
    get: props<QueryFilter>(),
    'get ok': props<{ pagination: Pagination<TypesCodeType> }>(),

    error: emptyProps(),
  },
});

// ---------------------------------------------------------------------------------------------------------------------
const url = `${environment.apiUrl}admin/code-type/types`;
@Injectable()
export class TypesCodeTypeEffects {
  get$ = createEffect(() =>
    this.actions$.pipe(
      ofType(_actions.get),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      exhaustMap(({ type, ...query }) => {
        const params = new HttpParams().appendAll(query);
        return this.httpClient.get<RequestApi<Pagination<TypesCodeType>>>(`${url}`, { params }).pipe(
          map((res) =>
            _actions.getOk({
              pagination: {
                ...res.data,
                content: res.data.content.map((item) => ({ ...item, value: item.code, label: item.title })),
              },
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
export class TypesCodeType {
  constructor(public code: string, public title: string, public iconClass: string) {}
}

export interface TypesCodeTypeState {
  pagination: Pagination<TypesCodeType>;
  data?: TypesCodeType;
  isLoading: boolean;
  status: 'idle' | 'get' | 'getOk' | 'error';
}

const initialState: TypesCodeTypeState = {
  pagination: emptyPagination(),
  data: undefined,
  isLoading: false,
  status: 'idle',
};

export const typesCodeTypeReducer = createReducer(
  initialState,
  on(_actions.get, (_state) => ({ ..._state, isLoading: true, status: 'get' })),
  on(_actions.getOk, (_state, pagination) => ({ ..._state, ...pagination, isLoading: false, status: 'getOk' })),

  on(_actions.error, (_state) => ({ ..._state, isLoading: false, status: 'error' })),
);

// ---------------------------------------------------------------------------------------------------------------------
@Injectable()
export class TypesCodeTypeFacade {
  select = createFeatureSelector<TypesCodeTypeState>(TYPES_CODE_TYPE_FEATURE_KEY);
  isLoading$ = this.store.select(createSelector(this.select, (state) => state.isLoading));
  status$ = this.store.select(createSelector(this.select, (state) => state.status));

  constructor(private store: Store) {}

  pagination$ = this.store.select(createSelector(this.select, (state) => state.pagination));
  list$ = this.store.select(createSelector(this.select, (state) => state.pagination.content));
  get = (query: QueryFilter) => this.store.dispatch(_actions.get(query));
}
