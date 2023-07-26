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
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { RequestApi } from '@model';
import { getLanguage, Message } from '@utils';
import { environment } from '@src/environments/environment';
import { User } from './bsd/users.store';

export const GLOBAL_FEATURE_KEY = '2d553039-1306-4296-bedb-3b936448ccda';

// ---------------------------------------------------------------------------------------------------------------------
const _actions = createActionGroup({
  source: GLOBAL_FEATURE_KEY,
  events: {
    login: props<{ email: string; password: string }>(),
    'login ok': props<{ user: Auth }>(),
    'login auto': emptyProps(),

    getInfo: emptyProps(),
    'getInfo ok': props<{ user: Auth }>(),
    logout: emptyProps(),

    collapsed: props<{ isCollapsed: boolean }>(),
    register: props<{ email: string; password: string }>(),
    setBreadcrumbs: props<{ breadcrumbs: Breadcrumb[] }>(),
    error: emptyProps(),
  },
});
// ---------------------------------------------------------------------------------------------------------------------
@Injectable()
export class GlobalEffects {
  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(_actions.login),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      exhaustMap(({ type, ...data }) => {
        return this.httpClient.post<RequestApi<Auth>>(environment.apiUrl + 'authentication/jwt/login', data).pipe(
          map((res) => this.login(res)),
          catchError(async ({ error }) => this.error(error)),
        );
      }),
    ),
  );

  getInfo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(_actions.getinfo),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      exhaustMap(({ type, ...data }) =>
        this.httpClient.post<RequestApi<Auth>>(environment.apiUrl + 'authentication/jwt/info', data).pipe(
          map((res) => {
            return _actions.getinfoOk({
              user: {
                ...res.data,
                userModel: {
                  ...res.data.userModel,
                  role: res.data.userModel?.listRole ? res.data.userModel.listRole[0].name : '',
                },
              },
            });
          }),
          catchError(async ({ error }) => this.error(error)),
        ),
      ),
    ),
  );

  register$ = createEffect(() =>
    this.actions$.pipe(
      ofType(_actions.register),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      exhaustMap(({ type, ...data }) => {
        return this.httpClient.post<RequestApi<Auth>>(environment.apiUrl + 'idm/users/register', data).pipe(
          map((res) => this.login(res)),
          catchError(async ({ error }) => this.error(error)),
        );
      }),
    ),
  );

  constructor(
    private actions$: Actions,
    private httpClient: HttpClient,
    private message: Message,
    private router: Router,
  ) {}
  login = (res: RequestApi<Auth>) => {
    this.message.success(res.message);
    localStorage.setItem(environment.userData, JSON.stringify(res.data));
    setTimeout(() => this.router.navigate([new URL(location.href).searchParams.get('returnUrl') || '/']));
    return _actions.loginOk({ user: res.data });
  };
  error = (error: RequestApi) => {
    if (error.message) this.message.error(error.message);
    return _actions.error();
  };
}

// ---------------------------------------------------------------------------------------------------------------------
export class Auth {
  constructor(
    public userId?: string,
    public userModel?: User,
    public tokenString?: string,
    public issuedAt?: string,
    public expiresAt?: string,
    public roleListCode?: string[],
    public appSettings?: {
      reloadOrderListAfterOrderActions: string[];
      reloadMenuAfterOrderActions: string[];
      productListStyle: string;
    },
  ) {}
}

interface Breadcrumb {
  title: string;
  link: string;
}

export interface GlobalState {
  user?: Auth;
  isLoading: boolean;
  isCollapsed: boolean;
  isDesktop: boolean;
  status: 'idle' | 'login' | 'loginOk' | 'register' | 'logout' | 'getInfo' | 'getInfoOk' | 'error';
  breadcrumbs: Breadcrumb[];
}

const initialState: GlobalState = {
  user: undefined,
  isLoading: false,
  isCollapsed: window.innerWidth < 1025,
  isDesktop: window.innerWidth > 767,
  status: 'idle',
  breadcrumbs: [],
};

export const globalReducer = createReducer(
  initialState,
  on(_actions.login, (_state) => ({ ..._state, isLoading: true, status: 'login' })),
  on(_actions.loginOk, (_state, data) => ({
    ..._state,
    ...data,
    isLoading: false,
    status: 'loginOk',
  })),

  on(_actions.getinfo, (_state) => ({ ..._state, isLoading: true, status: 'getInfo' })),
  on(_actions.getinfoOk, (_state, user) => ({
    ..._state,
    ...user,
    isLoading: false,
    status: 'getInfoOk',
  })),

  on(_actions.loginAuto, (_state) => {
    const user: User =
      localStorage.getItem(environment.userData) && JSON.parse(localStorage.getItem(environment.userData) || '');
    if (user) return { ..._state, isLoading: false, status: 'register', isLoggedIn: true, user };
    return { ..._state, isLoading: false, status: 'idle', isLoggedIn: false };
  }),
  on(_actions.logout, (_state) => ({
    ..._state,
    isLoading: false,
    status: 'logout',
    user: undefined,
  })),
  on(_actions.register, (_state) => ({ ..._state, isLoading: true, status: 'register' })),
  on(_actions.collapsed, (_state, data) => ({ ..._state, ...data })),
  on(_actions.setbreadcrumbs, (_state, data) => ({ ..._state, ...data })),
  on(_actions.error, (_state) => ({ ..._state, isLoading: false, status: 'error' })),
);

// ---------------------------------------------------------------------------------------------------------------------
@Injectable({ providedIn: 'root' })
export class GlobalFacade {
  select = createFeatureSelector<GlobalState>(GLOBAL_FEATURE_KEY);
  isLoading$ = this.store.select(createSelector(this.select, (state) => state.isLoading));
  status$ = this.store.select(createSelector(this.select, (state) => state.status));
  isDesktop$ = this.store.select(createSelector(this.select, (state) => state.isDesktop));

  constructor(private store: Store, private router: Router) {}

  user$ = this.store.select(createSelector(this.select, (state) => state.user));
  isLoggedIn$ = this.store.select(createSelector(this.select, (state) => !!state.user));
  login = (data: { email: string; password: string }) => this.store.dispatch(_actions.login(data));
  register = (data: { email: string; password: string }) => this.store.dispatch(_actions.register(data));
  autoLogin = () => this.store.dispatch(_actions.loginAuto());
  logout = () => {
    this.store.dispatch(_actions.logout());
    localStorage.removeItem(environment.userData);
    this.router.navigate([getLanguage() + '/auth']);
  };
  isCollapsed$ = this.store.select(createSelector(this.select, (state) => state.isCollapsed));
  collapsed = (isCollapsed: boolean) => this.store.dispatch(_actions.collapsed({ isCollapsed }));

  breadcrumbs$ = this.store.select(createSelector(this.select, (state) => state.breadcrumbs));
  setBreadcrumbs = (breadcrumbs: Breadcrumb[]) => this.store.dispatch(_actions.setbreadcrumbs({ breadcrumbs }));

  getInfo$ = this.store.select(createSelector(this.select, (state) => state.user));
  getInfo = () => this.store.dispatch(_actions.getinfo());
}
