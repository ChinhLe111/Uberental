import {
  createActionGroup,
  createFeatureSelector,
  createReducer,
  createSelector,
  on,
  props,
  Store,
  emptyProps,
} from '@ngrx/store';
import { environment } from '@src/environments/environment';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, map } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Pagination, QueryFilter, RequestApi } from '@model';
import { emptyPagination, Message } from '@utils';

export const USER_FEATURE_KEY = '8513184f-389f-4977-b4db-8782d86ffdbf';

// ---------------------------------------------------------------------------------------------------------------------
const _actions = createActionGroup({
  source: USER_FEATURE_KEY,
  events: {
    get: props<QueryFilter>(),
    'get ok': props<{ pagination: Pagination<User> }>(),

    getById: props<{ id: string }>(),
    'get by id ok': props<{ data: User }>(),

    post: props<{ data: User }>(),
    'post ok': props<{ data: User }>(),

    put: props<{ id: string; data: User }>(),
    'put ok': emptyProps(),

    delete: props<{ id: string }>(),
    'delete ok': emptyProps(),

    putLock: props<{ id: string }>(),
    'putLock ok': emptyProps(),

    putUnlock: props<{ id: string }>(),
    'putUnlock ok': emptyProps(),

    putPassword: props<{ id: string; password: string }>(),
    'putPassword ok': emptyProps(),

    'set id': props<{ id: string | null }>(),

    error: emptyProps(),
  },
});
// ---------------------------------------------------------------------------------------------------------------------
const url = `${environment.apiUrl}idm/users`;
@Injectable()
export class UserEffects {
  get$ = createEffect(() =>
    this.actions$.pipe(
      ofType(_actions.get),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      exhaustMap(({ type, ...query }) => {
        const params = new HttpParams().appendAll(query);
        return this.httpClient.get<RequestApi<Pagination<User>>>(`${url}`, { params }).pipe(
          map((res) =>
            _actions.getOk({
              pagination: {
                ...res.data,
                content: res.data.content.map((item) => ({
                  ...item,
                  role: item.listRole?.length ? item.listRole[0].name : '',
                  roleCode: item.listRole?.length ? item.listRole[0].code : '',
                })),
              },
            }),
          ),
          catchError(async ({ error }) => this.error(error)),
        );
      }),
    ),
  );

  getById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(_actions.getbyid),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      exhaustMap(({ type, id }) => {
        return this.httpClient.get<RequestApi<User>>(`${url}/${id}`).pipe(
          map((res) => {
            return _actions.getByIdOk({
              data: {
                ...res.data,
                role: res.data.listRole?.length ? res.data.listRole[0].code : '',
              },
            });
          }),
          catchError(async ({ error }) => this.error(error)),
        );
      }),
    ),
  );

  post$ = createEffect(() =>
    this.actions$.pipe(
      ofType(_actions.post),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      exhaustMap(({ type, ...query }) => {
        return this.httpClient.post<RequestApi<User>>(`${url}`, query.data).pipe(
          map((res) => {
            this.message.success(res.message);
            return _actions.postOk({ data: res.data });
          }),
          catchError(async ({ error }) => this.error(error)),
        );
      }),
    ),
  );

  put$ = createEffect(() =>
    this.actions$.pipe(
      ofType(_actions.put),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      exhaustMap(({ type, ...query }) => {
        return this.httpClient.put<RequestApi<User>>(`${url}/${query.id}`, query.data).pipe(
          map((res) => {
            this.message.success(res.message);
            return _actions.putOk();
          }),
          catchError(async ({ error }) => this.error(error)),
        );
      }),
    ),
  );

  delete$ = createEffect(() =>
    this.actions$.pipe(
      ofType(_actions.delete),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      exhaustMap(({ type, ...query }) => {
        return this.httpClient.delete<RequestApi<User>>(`${url}/${query.id}`).pipe(
          map((res) => {
            this.message.success(res.message);
            return _actions.deleteOk();
          }),
          catchError(async ({ error }) => this.error(error)),
        );
      }),
    ),
  );

  lock$ = createEffect(() =>
    this.actions$.pipe(
      ofType(_actions.putlock),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      exhaustMap(({ type, ...query }) => {
        return this.httpClient.put<RequestApi<User>>(`${url}/${query.id}/lock`, '').pipe(
          map((res) => {
            this.message.success(res.message);
            return _actions.putlockOk();
          }),
          catchError(async ({ error }) => this.error(error)),
        );
      }),
    ),
  );

  unlock$ = createEffect(() =>
    this.actions$.pipe(
      ofType(_actions.putunlock),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      exhaustMap(({ type, ...query }) => {
        return this.httpClient.put<RequestApi<User>>(`${url}/${query.id}/unlock`, '').pipe(
          map((res) => {
            this.message.success(res.message);
            return _actions.putunlockOk();
          }),
          catchError(async ({ error }) => this.error(error)),
        );
      }),
    ),
  );

  changePassword$ = createEffect(() =>
    this.actions$.pipe(
      ofType(_actions.putpassword),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      exhaustMap(({ type, ...query }) => {
        return this.httpClient.put<RequestApi<User>>(`${url}/${query.id}/password`, { password: query.password }).pipe(
          map((res) => {
            this.message.success(res.message);
            return _actions.putpasswordOk();
          }),
          catchError(async ({ error }) => this.error(error)),
        );
      }),
    ),
  );
  constructor(private actions$: Actions, private httpClient: HttpClient, private message: Message) {}
  error = (error: RequestApi) => {
    if (error?.message) this.message.error(error.message);
    return _actions.error();
  };
}

// ---------------------------------------------------------------------------------------------------------------------
export class User {
  constructor(
    public listRole?: {
      id?: string;
      code?: string;
      name?: string;
      isSystem?: boolean;
      level?: number;
    }[],
    public id?: string,
    public userName?: string,
    public name?: string,
    public phoneNumber?: string,
    public countryCode?: string,
    public gender?: string,
    public email?: string,
    public avatarUrl?: string,
    public bankAccountNo?: string,
    public bankName?: string,
    public bankUsername?: string,
    public birthdate?: string,
    public lastActivityDate?: string,
    public isLockedOut?: boolean,
    public isActive?: boolean,
    public activeDate?: string,
    public level?: number,
    public facebookUserId?: string,
    public googleUserId?: string,
    public emailVerifyToken?: string,
    public roleListCode?: string[],
    public profileType?: string,
    public createdOnDate?: string,
    public isEmailVerified?: boolean,
    public role?: string,
    public roleCode?: string,
  ) {}
}

export interface UserState {
  pagination: Pagination<User>;
  data?: User;
  query?: QueryFilter;
  isLoading: boolean;
  id: string | null;
  status:
    | 'idle'
    | 'get'
    | 'getOk'
    | 'getById'
    | 'getByIdOk'
    | 'post'
    | 'put'
    | 'putOk'
    | 'postOk'
    | 'delete'
    | 'deleteOk'
    | 'putLock'
    | 'putLockOk'
    | 'putUnlock'
    | 'putUnlockOk'
    | 'putPassword'
    | 'putPasswordOk'
    | 'setId'
    | 'error';
}

const initialState: UserState = {
  pagination: emptyPagination(),
  data: undefined,
  query: undefined,
  id: null,
  isLoading: false,
  status: 'idle',
};

export const userReducer = createReducer(
  initialState,
  on(_actions.setId, (_state, data) => ({ ..._state, ...data, status: 'setId' })),

  on(_actions.get, (_state, query) => ({ ..._state, query, isLoading: true, status: 'get' })),
  on(_actions.getOk, (_state, data) => ({ ..._state, ...data, isLoading: false, status: 'getOk' })),

  on(_actions.getbyid, (_state) => ({ ..._state, isLoading: true, status: 'getById' })),
  on(_actions.getByIdOk, (_state, data) => ({
    ..._state,
    ...data,
    isLoading: false,
    status: 'getByIdOk',
  })),

  on(_actions.post, (_state) => ({ ..._state, isLoading: true, status: 'post' })),
  on(_actions.postOk, (_state, data) => ({
    ..._state,
    ...data,
    isLoading: false,
    status: 'postOk',
  })),

  on(_actions.put, (_state) => ({ ..._state, isLoading: true, status: 'put' })),
  on(_actions.putOk, (_state) => ({
    ..._state,
    isLoading: false,
    status: 'putOk',
  })),

  on(_actions.delete, (_state) => ({ ..._state, isLoading: true, status: 'delete' })),
  on(_actions.deleteOk, (_state) => ({
    ..._state,
    isLoading: false,
    status: 'deleteOk',
  })),

  on(_actions.putlock, (_state) => ({ ..._state, isLoading: true, status: 'putLock' })),
  on(_actions.putlockOk, (_state) => ({
    ..._state,
    isLoading: false,
    status: 'putLockOk',
  })),

  on(_actions.putunlock, (_state) => ({ ..._state, isLoading: true, status: 'putUnlock' })),
  on(_actions.putunlockOk, (_state) => ({
    ..._state,
    isLoading: false,
    status: 'putUnlockOk',
  })),

  on(_actions.putpassword, (_state) => ({ ..._state, isLoading: true, status: 'putPassword' })),
  on(_actions.putpasswordOk, (_state) => ({
    ..._state,
    isLoading: false,
    status: 'putPasswordOk',
  })),

  on(_actions.error, (_state) => ({ ..._state, isLoading: false, status: 'error' })),
);

// ---------------------------------------------------------------------------------------------------------------------
@Injectable()
export class UserFacade {
  select = createFeatureSelector<UserState>(USER_FEATURE_KEY);
  isLoading$ = this.store.select(createSelector(this.select, (state) => state.isLoading));
  status$ = this.store.select(createSelector(this.select, (state) => state.status));
  query$ = this.store.select(createSelector(this.select, (state) => state.query));

  constructor(private store: Store) {}

  pagination$ = this.store.select(createSelector(this.select, (state) => state.pagination));
  getList = (query: QueryFilter) => this.store.dispatch(_actions.get(query));

  data$ = this.store.select(createSelector(this.select, (state) => state.data));
  getById = (id: string) => this.store.dispatch(_actions.getbyid({ id }));
  post = (data: User) => this.store.dispatch(_actions.post({ data }));

  put = (id: string, data: User) => this.store.dispatch(_actions.put({ id, data }));
  delete = (id: string) => this.store.dispatch(_actions.delete({ id }));
  putLock = (id: string) => this.store.dispatch(_actions.putlock({ id }));
  putUnlock = (id: string) => this.store.dispatch(_actions.putunlock({ id }));
  putPassword = (id: string, password: string) => this.store.dispatch(_actions.putpassword({ id, password }));

  id$ = this.store.select(createSelector(this.select, (state) => state.id));
  setId = (id: string | null) => this.store.dispatch(_actions.setId({ id }));
}
