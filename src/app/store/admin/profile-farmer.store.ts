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

import { environment } from '@src/environments/environment';
import { emptyPagination, Message } from '@utils';
import { Pagination, QueryFilter, RequestApi } from '@model';
import { Attachment } from '@src/app/store';
// ---------------------------------------------------------------------------------------------------------------------
const _actions = createActionGroup({
  source: 'profile-farmer',
  events: {
    get: props<QueryFilter>(),
    'get ok': props<{ pagination: Pagination<ProfileFarmer> }>(),

    getById: props<{ id: string }>(),
    'getById ok': props<{ data: ProfileFarmer }>(),

    put: props<{ id: string; data: ProfileFarmer }>(),
    'put ok': props<{ data: ProfileFarmer }>(),

    delete: props<{ id: string }>(),
    'delete ok': props<{ data: ProfileFarmer }>(),

    putApproveProfile: props<{ id: string }>(),
    'putApproveProfile ok': emptyProps(),

    'set id': props<{ id: string | null }>(),

    error: emptyProps(),
  },
});

// ---------------------------------------------------------------------------------------------------------------------

const url = `${environment.apiUrl}admin/farmer/profile`;

@Injectable()
export class ProfileFarmerEffects {
  get$ = createEffect(() =>
    this.actions$.pipe(
      ofType(_actions.get),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      exhaustMap(({ type, ...query }) => {
        const params = new HttpParams().appendAll(query);
        return this.httpClient.get<RequestApi<Pagination<ProfileFarmer>>>(url, { params }).pipe(
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
      exhaustMap(({ type, ...query }) =>
        this.httpClient.get<RequestApi<ProfileFarmer>>(`${url}/${query.id}`).pipe(
          map((res) => _actions.getbyidOk({ data: res.data })),
          catchError(async ({ error }) => this.error(error)),
        ),
      ),
    ),
  );
  put$ = createEffect(() =>
    this.actions$.pipe(
      ofType(_actions.put),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      exhaustMap(({ type, ...query }) =>
        this.httpClient.put<RequestApi<ProfileFarmer>>(`${url}/${query.id}`, query.data).pipe(
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
      exhaustMap(({ type, ...query }) =>
        this.httpClient.delete<RequestApi<ProfileFarmer>>(`${url}/${query.id}`).pipe(
          map((res) => {
            this.message.success(res.message);
            return _actions.deleteOk({ data: res.data });
          }),
          catchError(async ({ error }) => this.error(error)),
        ),
      ),
    ),
  );
  putApproveProfile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(_actions.putapproveprofile),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      exhaustMap(({ type, id }) => {
        const params = new HttpParams().append('id', id);
        return this.httpClient
          .put<RequestApi<ProfileFarmer>>(`${environment.apiUrl}me/farmer/profile/approve`, '', { params })
          .pipe(
            map((res) => {
              this.message.success(res.message);
              return _actions.putapproveprofileOk();
            }),
            catchError(async ({ error }) => this.error(error)),
          );
      }),
    ),
  );

  constructor(private actions$: Actions, private httpClient: HttpClient, private message: Message) {}

  error = (error: RequestApi) => {
    if (error.message) this.message.error(error.message);
    return _actions.error();
  };
}

// ---------------------------------------------------------------------------------------------------------------------
export const PROFILE_FARMER_FEATURE_KEY = 'ed8803df-9af9-4ecd-93b3-b39b3318b0dc';

export class ProfileFarmer {
  constructor(
    public medicalProcedure: {
      id: string;
      title: string;
      code: string;
      order: number;
      description: string;
      type: string;
      translations: {
        title: string;
        description: string;
        language: string;
      };
      createdOnDate: string;
      lastModifiedOnDate: string;
      name?: string;
    }[],
    public medicalDegree: {
      title: string;
      code: string;
    },
    public farmerAvatarUrl: Attachment,
    public province: {
      tenTinh: string;
      maTinh: number;
    },
    public commune: {
      communeCode: number;
      communeName: string;
    },
    public district: {
      districtCode: number;
      districtName: string;
    },
    public farmerNationalIdListImage: Attachment[],
    public farmerDegreeListImage: Attachment[],
    public farmerPreviousCustomerListImage: Attachment[],
    public attachments: Attachment[],
    public totalOrderReceivedCount: number,
    public totalOrderCompletedCount: number,
    public id: string,
    public name: string,
    public gender: string,
    public phoneNumber: string,
    public provinceCode: number,
    public districtCode: number,
    public communeCode: number,
    public address: string,
    public totalYearOfExperience: number,
    public workingProcessDescription: string,
    public medicalDegreeCode: string,
    public medicalProcedureListCode: string[],
    public lastModifiedOnDate: string,
    public statusCode: string,
    public code: string,
    public createdByUserId: string,
    public lastModifiedByUserId: string,
    public createdOnDate: string,
    public createdByUserName: string,
    public lastModifiedByUserName: string,
  ) {}
}

export interface ProfileFarmerState {
  pagination: Pagination<ProfileFarmer>;
  data?: ProfileFarmer;
  query?: QueryFilter;
  id: string | null;
  isLoading: boolean;
  status:
    | 'idle'
    | 'get'
    | 'getOk'
    | 'getById'
    | 'getByIdOk'
    | 'put'
    | 'putOk'
    | 'delete'
    | 'deleteOk'
    | 'putApproveProfile'
    | 'putApproveProfileOk'
    | 'error';
}

const initialState: ProfileFarmerState = {
  pagination: emptyPagination(),
  data: undefined,
  query: undefined,
  id: null,
  isLoading: false,
  status: 'idle',
};

export const profileFarmerReducer = createReducer(
  initialState,
  on(_actions.setId, (_state, id) => ({ ..._state, ...id })),

  on(_actions.get, (_state, query) => ({ ..._state, query, isLoading: true, status: 'get' })),
  on(_actions.getOk, (_state, pagination) => ({ ..._state, ...pagination, isLoading: false, status: 'getOk' })),

  on(_actions.getbyid, (_state) => ({ ..._state, isLoading: true, status: 'getById' })),
  on(_actions.getbyidOk, (_state, data) => ({ ..._state, ...data, isLoading: false, status: 'getByIdOk' })),

  on(_actions.put, (_state) => ({ ..._state, status: 'put' })),
  on(_actions.putOk, (_state, data) => ({ ..._state, ...data, status: 'putOk' })),

  on(_actions.delete, (_state) => ({ ..._state, status: 'delete' })),
  on(_actions.deleteOk, (_state, data) => ({ ..._state, ...data, status: 'deleteOk' })),

  on(_actions.putapproveprofile, (_state) => ({ ..._state, status: 'putApproveProfile' })),
  on(_actions.putapproveprofileOk, (_state) => ({ ..._state, status: 'putApproveProfileOk' })),

  on(_actions.error, (_state) => ({ ..._state, isLoading: true, status: 'error' })),
);

// ---------------------------------------------------------------------------------------------------------------------
@Injectable()
export class ProfileFarmerFacade {
  select = createFeatureSelector<ProfileFarmerState>(PROFILE_FARMER_FEATURE_KEY);
  isLoading$ = this.store.select(createSelector(this.select, (state) => state.isLoading));
  status$ = this.store.select(createSelector(this.select, (state) => state.status));

  constructor(private store: Store) {}

  pagination$ = this.store.select(createSelector(this.select, (state) => state.pagination));
  get = (query: QueryFilter) => this.store.dispatch(_actions.get(query));

  query$ = this.store.select(createSelector(this.select, (state) => state.query));
  id$ = this.store.select(createSelector(this.select, (state) => state.id));
  setId = (id: string | null) => this.store.dispatch(_actions.setId({ id }));

  data$ = this.store.select(createSelector(this.select, (state) => state.data));
  getById = (id: string) => this.store.dispatch(_actions.getbyid({ id }));

  put = (id: string, data: ProfileFarmer) => this.store.dispatch(_actions.put({ id, data }));
  delete = (id: string) => this.store.dispatch(_actions.delete({ id }));
  putApproveProfile = (id: string) => this.store.dispatch(_actions.putapproveprofile({ id }));
}
