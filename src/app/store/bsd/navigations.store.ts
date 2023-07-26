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

import { RequestApi } from '@model';
import { Message } from '@utils';
import { environment } from '@src/environments/environment';
import { Router } from '@angular/router';
import { NzTreeNodeOptions } from 'ng-zorro-antd/tree';

export const NAVIGATION_FEATURE_KEY = '7ace27cd-46cf-4ef0-9543-f2387399a12d';

// ---------------------------------------------------------------------------------------------------------------------
const _actions = createActionGroup({
  source: NAVIGATION_FEATURE_KEY,
  events: {
    post: props<{ data: Navigation }>(),
    'post ok': props<{ data: Navigation }>(),

    put: props<{ data: Navigation }>(),
    'put ok': props<{ data: Navigation }>(),

    delete: props<{ id: string }>(),
    'delete ok': props<{ data: Navigation }>(),

    getTree: props<{ isAdmin: 0 | 1; isGetRoles: boolean }>(),
    'getTree ok': props<{ navigationList: NzTreeNodeOptions[] }>(),

    getUserWebapp: emptyProps(),
    'getUserWebapp ok': props<{ navigationWebappList: any[] }>(),

    error: emptyProps(),
  },
});
// ---------------------------------------------------------------------------------------------------------------------
const url = `${environment.apiUrl}bsd/navigations`;
@Injectable()
export class NavigationEffects {
  post$ = createEffect(() =>
    this.actions$.pipe(
      ofType(_actions.post),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      exhaustMap(({ type, data }) =>
        this.httpClient.post<RequestApi<Navigation>>(`${url}`, data).pipe(
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
      exhaustMap(({ type, data }) =>
        this.httpClient.put<RequestApi<Navigation>>(`${url}/${data.id}`, data).pipe(
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
        this.httpClient.delete<RequestApi<Navigation>>(`${url}/${id}`).pipe(
          map((res) => {
            this.message.success(res.message);
            return _actions.deleteOk({ data: res.data });
          }),
          catchError(async ({ error }) => this.error(error)),
        ),
      ),
    ),
  );
  getTree$ = createEffect(() =>
    this.actions$.pipe(
      ofType(_actions.gettree),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      exhaustMap(({ type, ...query }) => {
        const params = new HttpParams().appendAll(query);
        return this.httpClient.get<RequestApi<Navigation[]>>(`${url}/tree`, { params }).pipe(
          map((res) => {
            return _actions.gettreeOk({
              navigationList: res.data.filter((i) => i.type === query.isAdmin).map((i) => this.mapMenuObject(i)),
            });
          }),
          catchError(async ({ error }) => this.error(error)),
        );
      }),
    ),
  );
  getUserWebapp$ = createEffect(() =>
    this.actions$.pipe(
      ofType(_actions.getuserwebapp),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      exhaustMap(({ type }) =>
        this.httpClient.get<RequestApi<Navigation[]>>(`${url}/user/webapp`).pipe(
          map((res) =>
            _actions.getuserwebappOk({
              navigationWebappList: res.data
                .filter((item) => item.type === 1)
                .map(({ iconClass, name, urlRewrite, level, subChild, code, queryParams }) => ({
                  code,
                  name,
                  level,
                  icon: iconClass,
                  path: [urlRewrite],
                  queryParams: JSON.parse(queryParams || '{}'),
                  open: subChild.filter((item: any) => this.router.url.indexOf(item.urlRewrite) > -1).length > 0,
                  child: subChild.map(({ iconClass, name, urlRewrite, level, code, queryParams }: any) => ({
                    code,
                    name,
                    level,
                    icon: iconClass,
                    path: [urlRewrite],
                    queryParams: JSON.parse(queryParams || '{}'),
                  })),
                })),
            }),
          ),
          catchError(async ({ error }) => this.error(error)),
        ),
      ),
    ),
  );
  constructor(
    private actions$: Actions,
    private httpClient: HttpClient,
    private message: Message,
    private router: Router,
  ) {}
  error = (error: RequestApi) => {
    if (error.message) this.message.error(error.message);
    return _actions.error();
  };
  private mapMenuObject(item: Navigation): NzTreeNodeOptions {
    return {
      ...item,
      title: item.name,
      icon: item.iconClass,
      key: item.id,
      isLeaf: !item.subChild?.length,
      expanded: true,
      children: !item.subChild ? null : item.subChild.map((i: any) => this.mapMenuObject(i)),
    } as NzTreeNodeOptions;
  }
}

// ---------------------------------------------------------------------------------------------------------------------
export class Navigation {
  constructor(
    public parentId: string,
    public urlRewrite: string,
    public iconClass: string,
    public subChild: any,
    public roleList: any,
    public subUrl: string,
    public type: number,
    public id: string,
    public code: string,
    public name: string,
    public idPath: string,
    public queryParams: string,
    public path: string,
    public level: number,
    public order: number,
    public status: boolean,
  ) {}
}

export interface NavigationState {
  navigationList: NzTreeNodeOptions[];
  navigationWebappList: any[];
  data?: Navigation;
  isLoading: boolean;
  status:
    | 'idle'
    | 'getTree'
    | 'getTreeOk'
    | 'getUserWebapp'
    | 'getUserWebappOk'
    | 'post'
    | 'postOk'
    | 'put'
    | 'putOk'
    | 'delete'
    | 'deleteOk'
    | 'error';
}

const initialState: NavigationState = {
  navigationList: [],
  navigationWebappList: [],
  data: undefined,
  isLoading: false,
  status: 'idle',
};

export const navigationReducer = createReducer(
  initialState,

  on(_actions.post, (_state) => ({ ..._state, isLoading: true, status: 'post' })),
  on(_actions.postOk, (_state, data) => ({ ..._state, ...data, isLoading: false, status: 'postOk' })),

  on(_actions.put, (_state) => ({ ..._state, isLoading: true, status: 'put' })),
  on(_actions.putOk, (_state, data) => ({ ..._state, ...data, isLoading: false, status: 'putOk' })),

  on(_actions.delete, (_state) => ({ ..._state, isLoading: true, status: 'delete' })),
  on(_actions.deleteOk, (_state, data) => ({ ..._state, ...data, isLoading: false, status: 'deleteOk' })),

  on(_actions.gettree, (_state) => ({ ..._state, isLoading: true, status: 'getTree' })),
  on(_actions.gettreeOk, (_state, data) => ({
    ..._state,
    ...data,
    isLoading: false,
    status: 'getTreeOk',
  })),

  on(_actions.getuserwebapp, (_state) => ({ ..._state, isLoading: true, status: 'getUserWebapp' })),
  on(_actions.getuserwebappOk, (_state, data) => ({
    ..._state,
    ...data,
    isLoading: false,
    status: 'getUserWebappOk',
  })),

  on(_actions.error, (_state) => ({ ..._state, isLoading: false, status: 'error' })),
);

// ---------------------------------------------------------------------------------------------------------------------
@Injectable()
export class NavigationFacade {
  select = createFeatureSelector<NavigationState>(NAVIGATION_FEATURE_KEY);
  isLoading$ = this.store.select(createSelector(this.select, (state) => state.isLoading));
  status$ = this.store.select(createSelector(this.select, (state) => state.status));

  constructor(private store: Store) {}

  navigationList$ = this.store.select(createSelector(this.select, (state) => state.navigationList));
  getTree = (isAdmin: 0 | 1, isGetRoles = true) => this.store.dispatch(_actions.gettree({ isAdmin, isGetRoles }));

  navigationWebappList$ = this.store.select(createSelector(this.select, (state) => state.navigationWebappList));
  getUserWebapp = () => this.store.dispatch(_actions.getuserwebapp());

  post = (data: Navigation) => this.store.dispatch(_actions.post({ data }));
  put = (data: Navigation) => this.store.dispatch(_actions.put({ data }));
  delete = (id: string) => this.store.dispatch(_actions.delete({ id }));
}
