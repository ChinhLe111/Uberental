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

export const WALLET_WITH_DRAWALS_FEATURE_KEY = '3705ba94-5563-42db-b5b5-8f7616534440';
// ---------------------------------------------------------------------------------------------------------------------
const _actions = createActionGroup({
  source: WALLET_WITH_DRAWALS_FEATURE_KEY,
  events: {
    get: props<QueryFilter>(),
    'get ok': props<{ pagination: Pagination<WalletWithDrawals> }>(),

    getById: props<{ id: string }>(),
    'getById ok': props<{ data: WalletWithDrawals }>(),

    putCancel: props<{ id: string; cancelReason: string }>(),
    'putCancel ok': emptyProps(),

    putComplete: props<{ id: string; listMessageId?: string[] }>(),
    'putComplete ok': emptyProps(),

    putConfirmTransferred: props<{ id: string }>(),
    'putConfirmTransferred ok': emptyProps(),

    getAttachmentsTemplate: props<{ id: string }>(),
    'getAttachmentsTemplate ok': props<{ dataAttachmentsTemplate: AttachmentsTemplate[] }>(),

    postAttachmentsMany: props<{ withdrawalsId: string; data: { id: string; description: string }[] }>(),
    'postAttachmentsMany ok': emptyProps(),

    error: emptyProps(),
  },
});
// ---------------------------------------------------------------------------------------------------------------------
const url = `${environment.apiUrl}wallet/withdrawals`;

@Injectable()
export class WalletWithDrawalsEffects {
  get$ = createEffect(() =>
    this.actions$.pipe(
      ofType(_actions.get),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      exhaustMap(({ type, ...query }) => {
        const params = new HttpParams().appendAll(query);
        return this.httpClient.get<RequestApi<Pagination<WalletWithDrawals>>>(`${url}`, { params }).pipe(
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
        this.httpClient.get<RequestApi<WalletWithDrawals>>(`${url}/${id}`).pipe(
          map((res) => _actions.getbyidOk({ data: res.data })),
          catchError(async ({ error }) => this.error(error)),
        ),
      ),
    ),
  );
  putCancel$ = createEffect(() =>
    this.actions$.pipe(
      ofType(_actions.putcancel),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      exhaustMap(({ type, id, cancelReason }) =>
        this.httpClient.put<RequestApi<WalletWithDrawals>>(`${url}/${id}/cancel`, { cancelReason: cancelReason }).pipe(
          map((res) => {
            this.message.success(res.message);
            return _actions.putcancelOk();
          }),
          catchError(async ({ error }) => this.error(error)),
        ),
      ),
    ),
  );
  putComplete$ = createEffect(() =>
    this.actions$.pipe(
      ofType(_actions.putcomplete),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      exhaustMap(({ type, id, listMessageId }) =>
        this.httpClient
          .put<RequestApi<WalletWithDrawals>>(`${url}/${id}/complete`, { listMessageId: listMessageId })
          .pipe(
            map((res) => {
              this.message.success(res.message);
              return _actions.putcompleteOk();
            }),
            catchError(async ({ error }) => this.error(error)),
          ),
      ),
    ),
  );
  putConfirmTransferred$ = createEffect(() =>
    this.actions$.pipe(
      ofType(_actions.putconfirmtransferred),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      exhaustMap(({ type, id }) =>
        this.httpClient.put<RequestApi<WalletWithDrawals>>(`${url}/${id}/confirm-transferred`, {}).pipe(
          map((res) => {
            this.message.success(res.message);
            return _actions.putconfirmtransferredOk();
          }),
          catchError(async ({ error }) => this.error(error)),
        ),
      ),
    ),
  );
  getAttachmentsTemplate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(_actions.getattachmentstemplate),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      exhaustMap(({ type, id }) =>
        this.httpClient.get<AttachmentsTemplate[]>(`${url}/${id}/attachments/template`).pipe(
          map((res) => _actions.getattachmentstemplateOk({ dataAttachmentsTemplate: res })),
          catchError(async ({ error }) => this.error(error)),
        ),
      ),
    ),
  );
  postAttachmentsMany$ = createEffect(() =>
    this.actions$.pipe(
      ofType(_actions.postattachmentsmany),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      exhaustMap(({ type, withdrawalsId, data }) =>
        this.httpClient.post<AttachmentsTemplate[]>(`${url}/${withdrawalsId}/attachments/many`, data).pipe(
          map(() => _actions.postattachmentsmanyOk()),
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

export class WalletWithDrawals {
  constructor(
    public receivedDate: string,
    public receivalConfirmedBy: string,
    public cancelReason: string,
    public createdByUserId: string,
    public lastModifiedByUser: string,
    public lastModifiedOnDate: string,
    public attachments: {
      id: string;
      docType: string;
      docTypeName: string;
      fileName: string;
      fileUrl: string;
      fileSize: number;
      fileType: string;
      createdOnDate: string;
      entityId: string;
      entityType: string;
      description: string;
    }[],
    public id: string,
    public amount: number,
    public status: string,
    public createdByUser: string,
    public createdByUserPhone: string,
    public transferContent: string,
    public createdOnDate: string,
    public isTransferConfirmed: boolean,
    public allowedActions: string[],
    public bankAccountName: string,
    public bankName: string,
    public bankAccountNumber: string,
  ) {}
}

export interface AttachmentsTemplate {
  docType: string;
  docTypeName: string;
  entityType: string;
  file: string;
  prefix: string;
  description: string;
}

export interface WalletWithDrawalsState {
  pagination: Pagination<WalletWithDrawals>;
  data?: WalletWithDrawals;
  dataAttachmentsTemplate?: AttachmentsTemplate[];
  isLoading: boolean;
  status:
    | 'idle'
    | 'get'
    | 'getOk'
    | 'getById'
    | 'getByIdOk'
    | 'putCancel'
    | 'putCancelOk'
    | 'putComplete'
    | 'putCompleteOk'
    | 'putConfirmTransferred'
    | 'putConfirmTransferredOk'
    | 'getAttachmentsTemplate'
    | 'getAttachmentsTemplateOk'
    | 'postAttachmentsMany'
    | 'postAttachmentsManyOk'
    | 'error';
}

const initialState: WalletWithDrawalsState = {
  pagination: emptyPagination(),
  data: undefined,
  dataAttachmentsTemplate: undefined,
  isLoading: false,
  status: 'idle',
};

export const walletWithDrawalsReducer = createReducer(
  initialState,
  on(_actions.get, (_state) => ({ ..._state, isLoading: true, status: 'get' })),
  on(_actions.getOk, (_state, pagination) => ({ ..._state, ...pagination, isLoading: false, status: 'getOk' })),

  on(_actions.getbyid, (_state) => ({ ..._state, isLoading: true, status: 'getById' })),
  on(_actions.getbyidOk, (_state, data) => ({ ..._state, ...data, isLoading: false, status: 'getByIdOk' })),

  on(_actions.putcancel, (_state) => ({ ..._state, isLoading: true, status: 'putCancel' })),
  on(_actions.putcancelOk, (_state) => ({ ..._state, isLoading: false, status: 'putCancelOk' })),

  on(_actions.putcomplete, (_state) => ({ ..._state, isLoading: true, status: 'putComplete' })),
  on(_actions.putcompleteOk, (_state) => ({ ..._state, isLoading: false, status: 'putCompleteOk' })),

  on(_actions.putconfirmtransferred, (_state) => ({ ..._state, isLoading: true, status: 'putConfirmTransferred' })),
  on(_actions.putconfirmtransferredOk, (_state) => ({
    ..._state,
    isLoading: false,
    status: 'putConfirmTransferredOk',
  })),

  on(_actions.getattachmentstemplate, (_state) => ({ ..._state, isLoading: true, status: 'getAttachmentsTemplate' })),
  on(_actions.getattachmentstemplateOk, (_state, dataAttachmentsTemplate) => ({
    ..._state,
    ...dataAttachmentsTemplate,
    isLoading: false,
    status: 'getAttachmentsTemplateOk',
  })),

  on(_actions.postattachmentsmany, (_state) => ({ ..._state, isLoading: true, status: 'postAttachmentsMany' })),
  on(_actions.postattachmentsmanyOk, (_state) => ({
    ..._state,
    isLoading: false,
    status: 'postAttachmentsManyOk',
  })),

  on(_actions.error, (_state) => ({ ..._state, isLoading: false, status: 'error' })),
);

// ---------------------------------------------------------------------------------------------------------------------
@Injectable()
export class WalletWithDrawalsFacade {
  select = createFeatureSelector<WalletWithDrawalsState>(WALLET_WITH_DRAWALS_FEATURE_KEY);
  isLoading$ = this.store.select(createSelector(this.select, (state) => state.isLoading));
  status$ = this.store.select(createSelector(this.select, (state) => state.status));

  constructor(private store: Store) {}

  pagination$ = this.store.select(createSelector(this.select, (state) => state.pagination));
  get = (query: QueryFilter) => this.store.dispatch(_actions.get(query));

  data$ = this.store.select(createSelector(this.select, (state) => state.data));
  getById = (id: string) => this.store.dispatch(_actions.getbyid({ id }));

  putCancel = (id: string, cancelReason: string) => this.store.dispatch(_actions.putcancel({ id, cancelReason }));
  putComplete = (id: string, listMessageId: string[]) =>
    this.store.dispatch(
      _actions.putcomplete({
        id,
        listMessageId,
      }),
    );
  putConfirmTransferred = (id: string) => this.store.dispatch(_actions.putconfirmtransferred({ id }));

  dataAttachmentsTemplate$ = this.store.select(createSelector(this.select, (state) => state.dataAttachmentsTemplate));
  // getAttachmentsTemplate = (id: string) => this.store.dispatch(_actions.getattachmentstemplate({ id }));
  postAttachmentsMany = (
    withdrawalsId: string,
    data: {
      id: string;
      description: string;
    }[],
  ) => this.store.dispatch(_actions.postattachmentsmany({ withdrawalsId, data }));
}
