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

import { emptyPagination, Message } from '@utils';
import { Pagination, QueryFilter, RequestApi } from '@model';
import { Attachment, AttachmentTemplate, Commune, District, Province } from '@src/app/store';

export const _actions = createActionGroup({
  source: 'clinics',
  events: {
    get: props<QueryFilter>(),
    'get ok': props<{ pagination: Pagination<Clinics> }>(),

    getById: props<{ id: string }>(),
    'getById ok': props<{ data: Clinics }>(),

    put: props<{ id: string; data: Clinics }>(),
    'put ok': props<{ data: Clinics }>(),

    postApproveClinic: props<{ id: string }>(),
    'postApproveClinic oK': props<{ data: Clinics }>(),

    'set id': props<{ id: string | null }>(),
    error: emptyProps(),
  },
});
const url = `${environment.apiUrl}admin/clinics`;

@Injectable()
export class ClinicsEffects {
  search$ = createEffect(() =>
    this.actions$.pipe(
      ofType(_actions.get),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      exhaustMap(({ type, ...query }) => {
        const params = new HttpParams().appendAll(query);
        return this.httpClient.get<RequestApi<Pagination<Clinics>>>(`${url}`, { params }).pipe(
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
      exhaustMap(({ type, id }) => {
        return this.httpClient.get<RequestApi<Clinics>>(`${url}/${id}`).pipe(
          map((res) => _actions.getbyidOk({ data: res.data })),
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
        return this.httpClient.put<RequestApi<Clinics>>(`${url}/${query.id}`, query.data).pipe(
          map((res) => {
            this.message.success(res.message);
            return _actions.putOk({ data: res.data });
          }),
          catchError(async ({ error }) => this.error(error)),
        );
      }),
    ),
  );

  postApproveClinic$ = createEffect(() =>
    this.actions$.pipe(
      ofType(_actions.postapproveclinic),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      exhaustMap(({ type, ...query }) => {
        return this.httpClient.post<RequestApi<Clinics>>(`${url}/${query.id}/approve`, query.id).pipe(
          map((res) => {
            this.message.success(res.message);
            return _actions.postapproveclinicOk({ data: res.data });
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

export const CLINICS_FEATURE_KEY = 'fd1671e8-f488-495e-9f02-ea6710827af8';

export class Clinics {
  constructor(
    public id: string,
    public name: string,
    public provinceCode: number,
    public districtCode: number,
    public communeCode: number,
    public address: string,
    public totalMachineSeats: number,
    public workingTimeDescription: string,
    public totalWorkingYear: number,
    public totalEmployee: number,
    public serviceDescription: string,
    public supervisorName: string,
    public supervisorDescription: string,
    public attachments: AttachmentTemplate[],
    public clinicAvatarUrl: string,
    public supervisorAvatarUrl: string,
    public province: Province,
    public commune: Commune,
    public district: District,
    public totalOrder: number,
    public lat: number,
    public long: number,
    public statusCode: string,
    public approvedUserId: string,
    public approvedUsername: string,
    public createdByUserId: string,
    public lastModifiedByUserId: string,
    public lastModifiedOnDate: string,
    public createdOnDate: string,
    public createdByUserName: string,
    public lastModifiedByUserName: string,
    public supervisorNationalIdListImage: Attachment[],
    public supervisorDegreeListImage: Attachment[],
    public clinicLicenseListImage: Attachment[],
    public clinicEquipmentListImage: Attachment[],
  ) {}
}

export interface ClinicsState {
  pagination: Pagination<Clinics>;
  query?: QueryFilter;
  data?: Clinics;
  isLoading: boolean;
  id: string | null;
  status:
    | 'idle'
    | 'get'
    | 'getOk'
    | 'getById'
    | 'getByIdOk'
    | 'put'
    | 'putOk'
    | 'postApproveClinic'
    | 'postApproveClinicOk'
    | 'error';
}

export const initialState: ClinicsState = {
  pagination: emptyPagination(),
  query: undefined,
  data: undefined,
  id: null,
  isLoading: false,
  status: 'idle',
};
export const clinicsReducer = createReducer(
  initialState,
  on(_actions.setId, (_state, data) => ({ ..._state, ...data })),
  on(_actions.get, (_state, query) => ({ ..._state, isLoading: true, status: 'get', query })),
  on(_actions.getOk, (_state, pagination) => ({ ..._state, ...pagination, isLoading: false, status: 'getOk' })),

  on(_actions.getbyid, (_state) => ({ ..._state, isLoading: true, status: 'getById' })),
  on(_actions.getbyidOk, (_state, data) => ({ ..._state, ...data, isLoading: false, status: 'getByIdOk' })),

  on(_actions.put, (_state) => ({ ..._state, isLoading: true, status: 'put' })),
  on(_actions.putOk, (_state, data) => ({ ..._state, ...data, isLoading: false, status: 'putOk' })),

  on(_actions.postapproveclinic, (_state) => ({ ..._state, isLoading: true, status: 'postApproveClinic' })),
  on(_actions.postapproveclinicOk, (_state, data) => ({
    ..._state,
    ...data,
    isLoading: false,
    status: 'postApproveClinicOk',
  })),

  on(_actions.error, (_state) => ({ ..._state, isLoading: false, status: 'error' })),
);

@Injectable()
export class ClinicsFacade {
  select = createFeatureSelector<ClinicsState>(CLINICS_FEATURE_KEY);
  isLoading$ = this.store.select(createSelector(this.select, (state) => state.isLoading));
  status$ = this.store.select(createSelector(this.select, (state) => state.status));

  constructor(private store: Store) {}

  pagination$ = this.store.select(createSelector(this.select, (state) => state.pagination));
  query$ = this.store.select(createSelector(this.select, (state) => state.query));
  get = (query: QueryFilter) => this.store.dispatch(_actions.get(query));

  data$ = this.store.select(createSelector(this.select, (state) => state.data));
  getById = (id: string) => this.store.dispatch(_actions.getbyid({ id }));

  put = (id: string, data: Clinics) => this.store.dispatch(_actions.put({ id, data }));

  postApproveClinic = (id: string) => this.store.dispatch(_actions.postapproveclinic({ id }));

  id$ = this.store.select(createSelector(this.select, (state) => state.id));
  setId = (id: string | null) => this.store.dispatch(_actions.setId({ id }));
}
