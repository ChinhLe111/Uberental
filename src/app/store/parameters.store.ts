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
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

export const PARAMETERS_FEATURE_KEY = '40af52b1-818e-4a74-9c92-b5734a2e3ac3';

// ---------------------------------------------------------------------------------------------------------------------
const _actions = createActionGroup({
  source: PARAMETERS_FEATURE_KEY,
  events: {
    getall: emptyProps(),
    'getall ok': props<{ list: Parameter[] }>(),

    post: props<{ data: Parameter }>(),
    'post ok': props<{ data: Parameter }>(),

    put: props<{ id: string; data: Parameter }>(),
    'put ok': props<{ data: Parameter }>(),

    delete: props<{ id: string }>(),
    'delete ok': props<{ data: Parameter }>(),

    getElasticSearch: props<{ name: string }>(),
    'getElasticSearch ok': props<{ dataElasticSearch: Parameter }>(),

    error: emptyProps(),
  },
});

// ---------------------------------------------------------------------------------------------------------------------
const url = `${environment.apiUrl}parameters`;

@Injectable()
export class ParametersEffects {
  getall$ = createEffect(() =>
    this.actions$.pipe(
      ofType(_actions.getall),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      exhaustMap(({ type, ...query }) => {
        const params = new HttpParams().appendAll(query);
        return this.httpClient.get<RequestApi<Parameter[]>>(`${url}/all`, { params }).pipe(
          map((res) => _actions.getallOk({ list: this.mapMenuObject(res.data) })),
          catchError(async ({ error }) => this.error(error)),
        );
      }),
    ),
  );
  post$ = createEffect(() =>
    this.actions$.pipe(
      ofType(_actions.post),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      exhaustMap(({ type, data }) =>
        this.httpClient.post<RequestApi<Parameter>>(`${url}`, data).pipe(
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
        this.httpClient.put<RequestApi<Parameter>>(`${url}/${id}`, data).pipe(
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
        this.httpClient.delete<RequestApi<Parameter>>(`${url}/${id}`).pipe(
          map((res) => {
            this.message.success(res.message);
            return _actions.deleteOk({ data: res.data });
          }),
          catchError(async ({ error }) => this.error(error)),
        ),
      ),
    ),
  );
  getElasticSearch$ = createEffect(() =>
    this.actions$.pipe(
      ofType(_actions.getelasticsearch),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      exhaustMap(({ type, name }) =>
        this.httpClient.get<RequestApi<Parameter>>(`${url}/elastic-search/${name}`).pipe(
          map((res) =>
            _actions.getelasticsearchOk({
              dataElasticSearch: {
                ...res.data,
                value: this.sanitizer.bypassSecurityTrustHtml(res.data.value as string),
              },
            }),
          ),
          catchError(async ({ error }) => this.error(error)),
        ),
      ),
    ),
  );

  constructor(
    private actions$: Actions,
    private message: Message,
    private httpClient: HttpClient,
    private sanitizer: DomSanitizer,
  ) {}

  error = (error: RequestApi) => {
    if (error.message) this.message.error(error.message);
    return _actions.error();
  };

  private mapMenuObject(arr: Parameter[]) {
    const groups: any = {};
    for (const item of arr) {
      const groupName = item.groupCode;
      if (!groups[groupName]) {
        groups[groupName] = [];
      }
      groups[groupName].push({
        ...item,
        title: item.name,
        key: item.id,
        isLeaf: true,
        expanded: true,
      });
    }

    const result: any[] = [];
    for (const groupName in groups) {
      result.push({
        title: groupName,
        key: groupName,
        expanded: true,
        isGroup: true,
        children: groups[groupName],
      });
    }
    return result;
  }
}

// ---------------------------------------------------------------------------------------------------------------------
export class Parameter {
  constructor(
    public id: string,
    public name: string,
    public value: string | SafeHtml,
    public description: string,
    public groupCode: string,
    public isSystem: boolean,
    public isPrimary: boolean,
    public createOnDate: string,
    public lastModifiedOnDate: string,
    public title: string,
    public key: string,
    public expanded: boolean,
    public isLeaf: boolean,
  ) {}
}

export interface ParametersState {
  list: Parameter[];
  dataElasticSearch?: Parameter;
  isLoading: boolean;
  status: 'idle' | 'getall' | 'getallOk' | 'post' | 'postOk' | 'put' | 'putOk' | 'delete' | 'deleteOk' | 'error';
}

const initialState: ParametersState = {
  list: [],
  dataElasticSearch: undefined,
  isLoading: false,
  status: 'idle',
};

export const parametersReducer = createReducer(
  initialState,
  on(_actions.getall, (_state, query) => ({ ..._state, isLoading: true, status: 'getall', query })),
  on(_actions.getallOk, (_state, pagination) => ({ ..._state, ...pagination, isLoading: false, status: 'getallOk' })),

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
  on(_actions.getelasticsearchOk, (_state, dataElasticSearch) => ({ ..._state, ...dataElasticSearch })),
  on(_actions.error, (_state) => ({ ..._state, isLoading: false, status: 'error' })),
);

// ---------------------------------------------------------------------------------------------------------------------
@Injectable()
export class ParametersFacade {
  select = createFeatureSelector<ParametersState>(PARAMETERS_FEATURE_KEY);
  isLoading$ = this.store.select(createSelector(this.select, (state) => state.isLoading));
  status$ = this.store.select(createSelector(this.select, (state) => state.status));

  constructor(private store: Store) {}

  list$ = this.store.select(createSelector(this.select, (state) => state.list));
  getall = () => this.store.dispatch(_actions.getall());

  post = (data: Parameter) => this.store.dispatch(_actions.post({ data }));

  put = (id: string, data: Parameter) => this.store.dispatch(_actions.put({ id, data }));
  delete = (id: string) => this.store.dispatch(_actions.delete({ id }));

  dataElasticSearch$ = this.store.select(createSelector(this.select, (state) => state.dataElasticSearch));
  getElasticSearch = () => this.store.dispatch(_actions.getelasticsearch({ name: 'ES_DASHBOARD_IFRAME' }));
}
