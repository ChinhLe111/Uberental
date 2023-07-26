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
import { Message } from '@utils';

export const CODE_TYPE_FEATURE_KEY = 'b7811ddc-d249-4b9a-99bd-1f5937f26ae6';
// ---------------------------------------------------------------------------------------------------------------------
const _actions = createActionGroup({
  source: CODE_TYPE_FEATURE_KEY,
  events: {
    getListGender: props<QueryFilter>(),
    'getListGender ok': props<{ listGender: Gender[] }>(),

    error: emptyProps(),
  },
});
// ---------------------------------------------------------------------------------------------------------------------
const url = `${environment.apiUrl}code-type`;
@Injectable()
export class CodeTypeEffects {
  getListGender$ = createEffect(() =>
    this.actions$.pipe(
      ofType(_actions.getlistgender),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      exhaustMap(({ type, ...query }) => {
        const params = new HttpParams().appendAll(query);
        return this.httpClient.get<RequestApi<Pagination<Gender>>>(`${url}/gender`, { params }).pipe(
          map((res) =>
            _actions.getlistgenderOk({
              listGender: res.data.content.map((item) => ({ ...item, value: item.code, label: item.title })),
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
export interface Gender {
  code: string;
  title: string;
  value: string;
  label: string;
}
export interface CodeTypeState {
  isLoading: boolean;
  listGender: Gender[];
  status: 'idle' | 'get' | 'getOk' | 'getListGender' | 'getListGenderOK' | 'error';
}

const initialState: CodeTypeState = {
  listGender: [],
  isLoading: false,
  status: 'idle',
};

export const codeTypeReducer = createReducer(
  initialState,

  on(_actions.getlistgender, (_state) => ({ ..._state, isLoading: true, status: 'getListGender' })),
  on(_actions.getlistgenderOk, (_state, listGender) => ({
    ..._state,
    ...listGender,
    isLoading: false,
    status: 'getListGenderOK',
  })),

  on(_actions.error, (_state) => ({ ..._state, isLoading: false, status: 'error' })),
);

// ---------------------------------------------------------------------------------------------------------------------
@Injectable()
export class CodeTypeFacade {
  select = createFeatureSelector<CodeTypeState>(CODE_TYPE_FEATURE_KEY);
  isLoading$ = this.store.select(createSelector(this.select, (state) => state.isLoading));
  status$ = this.store.select(createSelector(this.select, (state) => state.status));

  constructor(private store: Store) {}

  getListGender$ = this.store.select(createSelector(this.select, (state) => state.listGender));
  getListGender = (query: QueryFilter) => this.store.dispatch(_actions.getlistgender(query));
}
