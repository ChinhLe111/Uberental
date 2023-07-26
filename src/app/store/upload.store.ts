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

import { environment } from '@src/environments/environment';
import { RequestApi } from '@model';
import { Message } from '@utils';

export const UPLOAD_FEATURE_KEY = '0f7d387a-56fa-4690-955b-8187a47a979e';
type entityType = 'data' | 'post' | 'clinic' | 'farmer' | 'wallet';

// ---------------------------------------------------------------------------------------------------------------------
const _actions = createActionGroup({
  source: UPLOAD_FEATURE_KEY,
  events: {
    getAttachmentTemplates: props<{ entityType?: entityType }>(),
    'getAttachmentTemplates ok': props<{ attachmentTemplates: AttachmentTemplate[] }>(),

    error: emptyProps(),
  },
});
// ---------------------------------------------------------------------------------------------------------------------
const url = `${environment.apiUrl}upload`;

@Injectable()
export class UploadEffects {
  getAttachmentTemplates$ = createEffect(() =>
    this.actions$.pipe(
      ofType(_actions.getattachmenttemplates),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      exhaustMap(({ type, entityType }) =>
        this.httpClient.get<RequestApi<AttachmentTemplate[]>>(`${url}/${entityType}/attachment-templates`).pipe(
          map((res) => _actions.getattachmenttemplatesOk({ attachmentTemplates: res.data })),
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
export interface Editor {
  blocks?: {
    id?: string;
    type?: string;
    data?: {
      text?: string;
      level?: number;
      caption?: string;
      url?: string;
      file?: {
        url?: string;
      };
      stretched?: boolean;
      withBackGround?: boolean;
      withBorder?: boolean;
      item?: [];
      style?: string;
      code?: string;
      service?: string;
      source?: string;
      embed?: string;
      width?: number;
      height?: number;
      html?: string;
      alignment?: string;
      withHeadings?: boolean;
      content?: [];
    };
  }[];
  time?: string;
  version?: string;
}

export interface Attachment {
  id?: string;
  docType?: string;
  docTypeName?: string;
  fileName?: string;
  fileUrl?: string;
  fileSize?: string;
  fileType?: string;
  createdOnDate?: string;
  entityId?: string;
  entityType?: string;
  description?: string;
}

export interface AttachmentTemplate {
  entityType: string;
  docType: string;
  docTypeName: string;
  order: number;
  maxQuantity: number;
  minQuantity: number;
}

export interface UploadState {
  attachmentTemplates: AttachmentTemplate[];
  isLoading: boolean;
  status: 'idle' | 'getAttachmentTemplates' | 'getAttachmentTemplatesOk' | 'error';
  entityType?: entityType;
}

const initialState: UploadState = {
  attachmentTemplates: [],
  isLoading: false,
  status: 'idle',
  entityType: undefined,
};

export const uploadReducer = createReducer(
  initialState,
  on(_actions.getattachmenttemplates, (_state, data) => ({
    ..._state,
    isLoading: true,
    status: 'getAttachmentTemplates',
    entityType: data.entityType,
  })),
  on(_actions.getattachmenttemplatesOk, (_state, data) => ({
    ..._state,
    ...data,
    isLoading: false,
    status: 'getAttachmentTemplatesOk',
  })),

  on(_actions.error, (_state) => ({ ..._state, isLoading: false, status: 'error' })),
);

// ---------------------------------------------------------------------------------------------------------------------
@Injectable()
export class UploadFacade {
  select = createFeatureSelector<UploadState>(UPLOAD_FEATURE_KEY);
  isLoading$ = this.store.select(createSelector(this.select, (state) => state.isLoading));
  status$ = this.store.select(createSelector(this.select, (state) => state.status));

  constructor(private store: Store) {}

  entityType$ = this.store.select(createSelector(this.select, (state) => state.entityType));
  attachmentTemplates$ = this.store.select(createSelector(this.select, (state) => state.attachmentTemplates));
  getAttachmentTemplates = (entityType?: entityType) =>
    this.store.dispatch(_actions.getattachmenttemplates({ entityType }));
}
