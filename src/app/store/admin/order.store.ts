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
import { Attachment, CodeTypes, MedicalProcedure } from '@src/app/store';

export const ORDER_FEATURE_KEY = '12958c42-8d75-49e4-ac6e-eafa998b83bb';
const _actions = createActionGroup({
  source: ORDER_FEATURE_KEY,
  events: {
    get: props<QueryFilter>(),
    'get ok': props<{ pagination: PaginationOrder<Orders> }>(),

    getById: props<{ id: string }>(),
    'getById ok': props<{ data: Orders }>(),

    getListProposalById: props<{ id: string }>(),
    'getListProposalById ok': props<{ dataProposal: Proposal[] }>(),

    getDetailProposalById: props<{ id: string; proposalId: string }>(),
    'getDetailProposalById ok': props<{ dataDetailProposal: Proposal }>(),

    put: props<{ id: string; data: Orders }>(),
    'put ok': props<{ data: Orders }>(),

    postApproveOrder: props<{ id: string }>(),
    'postApproveOrder ok': props<{ id: string }>(),

    postRejectOrder: props<{ id: string; note: string }>(),
    'postRejectOrder ok': emptyProps(),

    postDistributionOrder: props<{ id: string }>(),
    'postDistributionOrder ok': props<{ id: string }>(),

    getListTreamentDiaries: props<{ id: string } & QueryFilter>(),
    'getListTreamentDiaries ok': props<{ paginationTreamentDiaries: Pagination<TreamentDiaries> }>(),
    getDetailTreamentDiaries: props<{ id: string }>(),
    'getDetailTreamentDiaries ok': props<{ dataTreamentDiaries: TreamentDiaries }>(),
    getListClaims: props<{ id: string } & QueryFilter>(),
    'getListClaims ok': props<{ paginationClaims: Pagination<Claims> }>(),
    getDetailClaims: props<{ id: string }>(),
    'getDetailClaims ok': props<{ dataClaims: Claims }>(),
    getPaymentHistory: props<{ id: string } & QueryFilter>(),
    'getPaymentHistory ok': props<{ paginationPaymentHistory: Pagination<Orders> }>(),
    postPaymentSetting: props<{ id: string; dataPaymentSetting: paymentSettings }>(),
    'postPaymentSetting ok': props<{ dataPaymentSetting: paymentSettings }>(),
    postTranferFarmer: props<{ id: string; dataTranferFarmer: TranferFarmer }>(),
    'postTranferFarmer ok': props<{ dataTranferFarmer: TranferFarmer }>(),
    'set id': props<{ id: string | null }>(),
    getFeedBack: props<QueryFilter>(),
    'getFeedBack ok': props<{ paginationFeedBack: PaginationOrder<Orders> }>(),
    putApproveClaims: props<{ id: string }>(),
    'putApproveClaims ok': props<{ id: string }>(),
    putRejectClaims: props<{ id: string; rejectReason: string }>(),
    'putRejectClaims ok': emptyProps(),

    getFeedBackFarmer: props<{ id: string }>(),
    'getFeedBackFarmer ok': props<{ dataFeedBack: FeedBacks }>(),
    'getFeedBackFarmer error': emptyProps(),

    getFeedBackClinic: props<{ id: string }>(),
    'getFeedBackClinic ok': props<{ dataFeedBack: FeedBacks }>(),
    'getFeedBackClinic error': emptyProps(),

    error: emptyProps(),
  },
});

// ---------------------------------------------------------------------------------------------------------------------
const url = `${environment.apiUrl}admin/orders`;

@Injectable()
export class OrdersEffects {
  get$ = createEffect(() =>
    this.actions$.pipe(
      ofType(_actions.get),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      exhaustMap(({ type, ...query }) => {
        const params = new HttpParams().appendAll(query);
        return this.httpClient.get<RequestApi<PaginationOrder<Orders>>>(`${url}`, { params }).pipe(
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
        this.httpClient.get<RequestApi<Orders>>(`${url}/${query.id}`).pipe(
          map((res) => _actions.getbyidOk({ data: res.data })),
          catchError(async ({ error }) => this.error(error)),
        ),
      ),
    ),
  );
  getListProposalById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(_actions.getlistproposalbyid),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      exhaustMap(({ type, ...query }) =>
        this.httpClient.get<RequestApi<Proposal[]>>(`${url}/${query.id}/proposal`).pipe(
          map((res) => _actions.getlistproposalbyidOk({ dataProposal: res.data })),
          catchError(async ({ error }) => this.error(error)),
        ),
      ),
    ),
  );
  getDetailProposalById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(_actions.getdetailproposalbyid),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      exhaustMap(({ type, ...query }) =>
        this.httpClient.get<RequestApi<Proposal>>(`${url}/${query.id}/proposal/${query.proposalId}`).pipe(
          map((res) => _actions.getdetailproposalbyidOk({ dataDetailProposal: res.data })),
          catchError(async ({ error }) => this.error(error)),
        ),
      ),
    ),
  );
  postApproveOrder$ = createEffect(() =>
    this.actions$.pipe(
      ofType(_actions.postapproveorder),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      exhaustMap(({ type, ...query }) =>
        this.httpClient.post<RequestApi<Orders>>(`${url}/${query.id}/approve`, query.id).pipe(
          map((res) => {
            this.message.success(res.message);
            return _actions.postapproveorderOk({ id: query.id });
          }),
          catchError(async ({ error }) => this.error(error)),
        ),
      ),
    ),
  );
  postRejectOrder$ = createEffect(() =>
    this.actions$.pipe(
      ofType(_actions.postrejectorder),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      exhaustMap(({ type, id, note }) =>
        this.httpClient.post<RequestApi<Orders>>(`${url}/${id}/reject`, { note }).pipe(
          map((res) => {
            this.message.success(res.message);
            return _actions.postrejectorderOk();
          }),
          catchError(async ({ error }) => this.error(error)),
        ),
      ),
    ),
  );
  posDistributionOrder$ = createEffect(() =>
    this.actions$.pipe(
      ofType(_actions.postdistributionorder),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      exhaustMap(({ type, ...query }) =>
        this.httpClient.post<RequestApi<Orders>>(`${url}/${query.id}/distribution`, query.id).pipe(
          map((res) => {
            this.message.success(res.message);
            return _actions.postdistributionorderOk({ id: query.id });
          }),
          catchError(async ({ error }) => this.error(error)),
        ),
      ),
    ),
  );
  getTreamentDiaries$ = createEffect(() =>
    this.actions$.pipe(
      ofType(_actions.getlisttreamentdiaries),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      exhaustMap(({ type, id, ...query }) => {
        const params = new HttpParams().appendAll(query);
        return this.httpClient
          .get<RequestApi<Pagination<TreamentDiaries>>>(`${url}/${id}/treament-diaries`, { params })
          .pipe(
            map((res) => _actions.getlisttreamentdiariesOk({ paginationTreamentDiaries: res.data })),
            catchError(async ({ error }) => this.error(error)),
          );
      }),
    ),
  );
  getDetailTreamentDiaries$ = createEffect(() =>
    this.actions$.pipe(
      ofType(_actions.getdetailtreamentdiaries),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      exhaustMap(({ type, ...query }) =>
        this.httpClient.get<RequestApi<TreamentDiaries>>(`${url}/treament-diaries/${query.id}`).pipe(
          map((res) => _actions.getdetailtreamentdiariesOk({ dataTreamentDiaries: res.data })),
          catchError(async ({ error }) => this.error(error)),
        ),
      ),
    ),
  );
  getClaims$ = createEffect(() =>
    this.actions$.pipe(
      ofType(_actions.getlistclaims),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      exhaustMap(({ type, id, ...query }) => {
        const params = new HttpParams().appendAll(query);
        return this.httpClient.get<RequestApi<Pagination<Claims>>>(`${url}/${id}/claim`, { params }).pipe(
          map((res) => _actions.getlistclaimsOk({ paginationClaims: res.data })),
          catchError(async ({ error }) => this.error(error)),
        );
      }),
    ),
  );
  getDetailClaims$ = createEffect(() =>
    this.actions$.pipe(
      ofType(_actions.getdetailclaims),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      exhaustMap(({ type, ...query }) =>
        this.httpClient.get<RequestApi<Claims>>(`${environment.apiUrl}orderer-claims/${query.id}`).pipe(
          map((res) => _actions.getdetailclaimsOk({ dataClaims: res.data })),
          catchError(async ({ error }) => this.error(error)),
        ),
      ),
    ),
  );
  getPaymentHistory$ = createEffect(() =>
    this.actions$.pipe(
      ofType(_actions.getpaymenthistory),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      exhaustMap(({ type, id, ...query }) => {
        const params = new HttpParams().appendAll(query);
        return this.httpClient.get<RequestApi<Pagination<Orders>>>(`${url}/${id}/payment`, { params }).pipe(
          map((res) => _actions.getpaymenthistoryOk({ paginationPaymentHistory: res.data })),
          catchError(async ({ error }) => this.error(error)),
        );
      }),
    ),
  );
  postPaymentSetting$ = createEffect(() =>
    this.actions$.pipe(
      ofType(_actions.postpaymentsetting),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      exhaustMap(({ type, id, dataPaymentSetting }) =>
        this.httpClient.post<RequestApi<paymentSettings>>(`${url}/${id}/payment`, dataPaymentSetting).pipe(
          map((res) => {
            this.message.success(res.message);
            return _actions.postpaymentsettingOk({ dataPaymentSetting: res.data });
          }),
          catchError(async ({ error }) => this.error(error)),
        ),
      ),
    ),
  );
  postTranferFarmer$ = createEffect(() =>
    this.actions$.pipe(
      ofType(_actions.posttranferfarmer),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      exhaustMap(({ type, id, dataTranferFarmer }) =>
        this.httpClient.post<RequestApi<TranferFarmer>>(`${url}/${id}/tranfer-farmer`, dataTranferFarmer).pipe(
          map((res) => {
            this.message.success(res.message);
            return _actions.posttranferfarmerOk({ dataTranferFarmer: res.data });
          }),
          catchError(async ({ error }) => this.error(error)),
        ),
      ),
    ),
  );
  getFeedBack$ = createEffect(() =>
    this.actions$.pipe(
      ofType(_actions.getfeedback),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      exhaustMap(({ type, ...query }) => {
        const params = new HttpParams().appendAll(query);
        return this.httpClient.get<RequestApi<PaginationOrder<Orders>>>(`${url}/feedback`, { params }).pipe(
          map((res) => _actions.getfeedbackOk({ paginationFeedBack: res.data })),
          catchError(async ({ error }) => this.error(error)),
        );
      }),
    ),
  );
  putApproveClaims$ = createEffect(() =>
    this.actions$.pipe(
      ofType(_actions.putapproveclaims),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      exhaustMap(({ type, ...query }) =>
        this.httpClient
          .put<RequestApi<Orders>>(`${environment.apiUrl}orderer-claims/${query.id}/approve`, query.id)
          .pipe(
            map((res) => {
              this.message.success(res.message);
              return _actions.putapproveclaimsOk({ id: query.id });
            }),
            catchError(async ({ error }) => this.error(error)),
          ),
      ),
    ),
  );
  putRejectClaims$ = createEffect(() =>
    this.actions$.pipe(
      ofType(_actions.putrejectclaims),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      exhaustMap(({ type, id, rejectReason }) =>
        this.httpClient
          .put<RequestApi<Orders>>(`${environment.apiUrl}orderer-claims/${id}/reject`, { rejectReason })
          .pipe(
            map((res) => {
              this.message.success(res.message);
              return _actions.putrejectclaimsOk();
            }),
            catchError(async ({ error }) => this.error(error)),
          ),
      ),
    ),
  );

  getFeedBackFarmer$ = createEffect(() =>
    this.actions$.pipe(
      ofType(_actions.getfeedbackfarmer),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      exhaustMap(({ type, ...query }) =>
        this.httpClient.get<RequestApi<FeedBacks>>(`${url}/${query.id}/feedback-farmer`).pipe(
          map((res) => _actions.getfeedbackfarmerOk({ dataFeedBack: res.data })),
          catchError(async ({ error }) => {
            return _actions.getfeedbackfarmerError();
          }),
        ),
      ),
    ),
  );

  getFeedBackClinic$ = createEffect(() =>
    this.actions$.pipe(
      ofType(_actions.getfeedbackclinic),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      exhaustMap(({ type, ...query }) =>
        this.httpClient.get<RequestApi<FeedBacks>>(`${url}/${query.id}/feedback-clinic`).pipe(
          map((res) => _actions.getfeedbackclinicOk({ dataFeedBack: res.data })),
          catchError(async ({ error }) => {
            return _actions.getfeedbackclinicError();
          }),
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
export interface TranferFarmer {
  farmerSideId: string;
  implementationDate: string;
}

export interface PaginationOrder<T> {
  content: T[];
  statisticOrder: statisticOrder[];
  numberOfElements: number;
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface paymentSettings {
  isOneTimePayment: boolean;
  paymentStartDate: string;
  firstPaymentAmount: number;
  unitTime: string;
  repeatCount: number;
  paymentAmount: number;
}

export interface statisticOrder {
  status: string;
  count: number;
}

export interface Proposal {
  id: string;
  senderId: string;
  isAccepted: boolean;
  senderType?: string;
  note?: string;
  oldDifficultyCode?: string;
  oldCommissionAmount?: number;
  totalFarmerActuallyReceivedAmount?: number;
  totalCommissionAmount?: number;
  oldTreatmentDate?: string;
  newDifficulty?: {
    title: string;
    code: string;
  };
  newDifficultyCode?: string;
  newCommissionAmount?: number;
  newTreatmentDate?: string;
  oldDifficulty?: {
    code: string;
    title?: string;
  };
}

export class Claims {
  constructor(
    public id: string,
    public orderNo: string,
    public clinnicId: string,
    public medicalRecordId: string,
    public farmerUserId: string,
    public hasFeedback: boolean,
    public createdByUserId: string,
    public createdOnDate: string,
    public refundReasonId: string,
    public refundReason: {
      id: string;
      refundReason?: string;
      createdByUserId: string;
      createdOnDate: string;
    },
    public attachments: Attachment[],
    public feedbackDescription?: string,
    public statusCode?: string,
    public claimDescription?: string,
    public feedbackOnDate?: string,
    public feedbackByUserId?: string,
    public errorDescription?: string,
    public farmerUserName?: string,
    public rejectReason?: string,
  ) {}
}

export class TreamentDiaries {
  constructor(
    public id: string,
    public medicalRecordId: string,
    public treatmentDate: string,
    public attachments: Attachment[],
    public medrecImgBeforeListUrl: Attachment[],
    public medrecFilmBeforeListUrl: Attachment[],
    public medrecFilmAfterListUrl: Attachment[],
    public medrecImgAfterListUrl: Attachment[],
    public farmerName?: string,
    public medicalRecordNo?: string,
    public treatmentContent?: string,
    public numbersOfTeeth?: [],
  ) {}
}

export class FeedBacks {
  constructor(
    public id: string,
    public orderId: string,
    public entityid: string,
    public rating: number,
    public isPositive: boolean,
    public content: string,
    public createdOnDate: string,
    public createdByUser: {
      userName: string;
      name: string;
      email: string;
      avatarUrl: string;
    },
    public order: {
      id: string;
      orderNo: string;
      clinicId: string;
      clinicName: string;
      provinceCode: number;
      provice: {
        tenTinh: string;
      };
      districtCode: number;
      district: {
        districtName: string;
        description: string;
      };
      communeCode: number;
      commune: {
        communeName: string;
      };
      address: string;
      fullTextAddress: string;
      implementationDate: string;
      medicalProcedureGroupCode: string;
      medicalProcedureCode: string;
      statusCode: string;
      farmerSideId: string;
      note: string;
      platformFee: number;
      totalCommissionAmount: number;
      totalPaidAmount: number;
      totalRemainingAmount: number;
      totalOrderAmount: number;
      ordererDepositTransactionId: string;
      orderDepositAmount: number;
      farmerDepositTransactionId: string;
      totalFarmerDepositAmount: number;
      totalFarmerActuallyReceivedAmount: number;
      currentUserConnectStatus: string;
      allowedActions: string;
      medicalRecord: string;
      createdOnDate: string;
      isOneTimeProcedure: boolean;
      threadId: string;
      farmerProfile: string;
      peakHourFeeAmount: number;
      lastModifiedOnDate: string;
      createdByUserName: string;
      receivedOnDate: string;
      paymentStartDate: string;
      paymentEndDate: string;
      completeConfirmedDate: string;
      isCompleteConfirmed: boolean;
      paymentSetting: string;
    },
  ) {}
}

export class Orders {
  constructor(
    public id: string,
    public implementationDate: string,
    public medicalProcedureGroup: CodeTypes,
    public medicalProcedureCode: string,
    public medicalProcedure: MedicalProcedure,
    public platformFee: number,
    public peakHourFeeAmount: number,
    public totalCommissionAmount: number,
    public totalPaidAmount: number,
    public totalRemainingAmount: number,
    public totalOrderAmount: number,
    public orderDepositAmount: number,
    public totalFarmerDepositAmount: number,
    public totalFarmerActuallyReceivedAmount: number,
    public currentUserConnectStatus: {
      isClaims: boolean;
      isOwner: boolean;
      isConnectAvailable: boolean;
      isConnected: boolean;
      isDistributed: boolean;
    },
    // public allowedActions?:	{},
    public medicalRecord: {
      id: string;
      customerName?: string;
      birthday: string;
      gender?: string;
      orderNo?: string;
      orderId: string;
      medicalRecordNo?: string;
      isChildrenCustomer: boolean;
      difficultyCode?: string;
      difficulty: CodeTypes;
      baseCommissionAmount: number;
      totalCommissionAmount: number;
      commissionAmount: number;
      totalTreatedCount: number;
      description?: string;
      farmerUserId?: string;
      statusCode?: string;
      patientCondition?: string;
      numbersOfTeeth: [];
      medicalHistory?: string;
      paymentStatusCode?: string;
      paidCommissionAmount: number;
      remainingCommissionAmount: number;
      farmerDepositAmount: number;
      farmerDepositPercentage: number;
      attachments?: Attachment[];
      currentUserConnectStatus: {
        isOwner: boolean;
        isConnectAvailable: boolean;
        isConnected: boolean;
        isDistributed: boolean;
        // allowedActions:	{},
      };
      medrecFilmBeforeListUrl?: Attachment[];
      medrecImgBeforeListUrl?: Attachment[];
      numbersOfTeethTypes?: {
        code: string;
        title: string;
      }[];
    },
    public createdOnDate: string,
    public isOneTimeProcedure: boolean,
    public threadId: string,
    public farmerProfile: {
      name?: string;
      gender?: string;
      medicalDegree: CodeTypes;
      id: string;
      farmerAvatarUrl: string;
      createdByUserName: string;
      address: string;
      province: { tenTinh: string; maTinh: number };
      provinceCode: number;
      district: { districtCode: number; districtName: string };
      districtCode: number;
      commune: { communeCode: number; communeName: string };
      communeCode: number;
    },
    public clinicId: string,
    public createdByUserName?: string,
    public orderNo?: string,
    public address?: string,
    public clinicName?: string,
    public fullTextAddress?: string,
    public medicalProcedureGroupCode?: string,
    public statusCode?: string,
    public approvedUserId?: string,
    public farmerSideId?: string,
    public note?: string,
    public ordererDepositTransactionId?: string,
    public farmerDepositTransactionId?: string,
    public lastModifiedOnDate?: string,
    public receivedOnDate?: string,
    public paymentStartDate?: string,
    public paymentEndDate?: string,
    public paymentDate?: string,
    public paymentSetting?: paymentSettings,
    public CompleteConfirmedDate?: string,
    public provinceCode?: number,
  ) {}
}

export interface OrdersState {
  pagination: PaginationOrder<Orders>;
  data?: Orders;
  id: string | null;
  query?: QueryFilter;
  paginationPaymentHistory: Pagination<Orders>;
  paginationFeedBack: PaginationOrder<Orders>;
  paginationTreamentDiaries?: Pagination<TreamentDiaries>;
  dataTreamentDiaries?: TreamentDiaries;
  paginationClaims?: Pagination<Claims>;
  dataClaims?: Claims;
  dataFeedBack?: FeedBacks;
  dataProposal?: Proposal[];
  dataDetailProposal?: Proposal;
  dataPayments?: paymentSettings;
  dataTranferFarmer?: TranferFarmer;
  isLoading: boolean;
  status:
    | 'idle'
    | 'get'
    | 'getOk'
    | 'getById'
    | 'getById ok'
    | 'getListProposalById'
    | 'getListProposalById ok'
    | 'getDetailProposalById'
    | 'getDetailProposalById ok'
    | 'postApproveOrder'
    | 'postApproveOrder ok'
    | 'postRejectOrder'
    | 'postRejectOrder ok'
    | 'postDistributionOrder'
    | 'postDistributionOrder ok'
    | 'getListTreamentDiaries'
    | 'getListTreamentDiaries ok'
    | 'getDetailTreamentDiaries'
    | 'getDetailTreamentDiaries ok'
    | 'getListClaims'
    | 'getListClaims ok'
    | 'getDetailClaims'
    | 'getDetailClaims ok'
    | 'getPaymentHistory'
    | 'getPaymentHistory ok'
    | 'postPaymentSetting'
    | 'postPaymentSetting ok'
    | 'postTranferFarmer'
    | 'postTranferFarmer ok'
    | 'getFeedBack'
    | 'getFeedBack ok'
    | 'putApproveClaims'
    | 'putApproveClaims ok'
    | 'putRejectClaims'
    | 'putRejectClaims ok'
    | 'getFeedBackFarmer'
    | 'getFeedBackFarmer ok'
    | 'getFeedBackFarmer error'
    | 'getFeedBackClinic'
    | 'getFeedBackClinic ok'
    | 'getFeedBackClinic error'
    | 'error';
}

export function emptyPaginationOrder(): PaginationOrder<any> {
  return {
    content: [],
    statisticOrder: [],
    numberOfElements: 0,
    page: 0,
    size: 0,
    totalElements: 0,
    totalPages: 0,
  };
}

const initialState: OrdersState = {
  pagination: emptyPaginationOrder(),
  paginationPaymentHistory: emptyPagination(),
  paginationFeedBack: emptyPaginationOrder(),
  data: undefined,
  id: null,
  query: undefined,
  dataProposal: [],
  dataDetailProposal: undefined,
  paginationTreamentDiaries: emptyPagination(),
  dataTreamentDiaries: undefined,
  paginationClaims: emptyPagination(),
  dataClaims: undefined,
  dataFeedBack: undefined,
  dataPayments: undefined,
  dataTranferFarmer: undefined,
  isLoading: false,
  status: 'idle',
};

export const ordersReducer = createReducer(
  initialState,
  on(_actions.setId, (_state, data) => ({ ..._state, ...data })),
  on(_actions.get, (_state, query) => ({ ..._state, isLoading: true, status: 'get', query })),
  on(_actions.getOk, (_state, pagination) => ({ ..._state, ...pagination, isLoading: false, status: 'getOk' })),

  on(_actions.getbyid, (_state) => ({ ..._state, isLoading: true, status: 'getById' })),
  on(_actions.getbyidOk, (_state, data) => ({
    ..._state,
    ...data,
    isLoading: false,
    status: 'getById ok',
  })),

  on(_actions.getlistproposalbyid, (_state) => ({ ..._state, isLoading: true, status: 'getListProposalById' })),
  on(_actions.getlistproposalbyidOk, (_state, dataProposal) => ({
    ..._state,
    ...dataProposal,
    isLoading: false,
    status: 'getListProposalById ok',
  })),

  on(_actions.getdetailproposalbyid, (_state) => ({ ..._state, isLoading: true, status: 'getDetailProposalById' })),
  on(_actions.getdetailproposalbyidOk, (_state, dataDetailProposal) => ({
    ..._state,
    ...dataDetailProposal,
    isLoading: false,
    status: 'getDetailProposalById ok',
  })),

  on(_actions.postapproveorder, (_state) => ({ ..._state, isLoading: true, status: 'postApproveOrder' })),
  on(_actions.postapproveorderOk, (_state, data) => ({
    ..._state,
    ...data,
    isLoading: false,
    status: 'postApproveOrder ok',
  })),

  on(_actions.postrejectorder, (_state) => ({ ..._state, isLoading: true, status: 'postRejectOrder' })),
  on(_actions.postrejectorderOk, (_state, data) => ({
    ..._state,
    ...data,
    isLoading: false,
    status: 'postRejectOrder ok',
  })),

  on(_actions.postdistributionorder, (_state) => ({ ..._state, isLoading: true, status: 'postDistributionOrder' })),
  on(_actions.postdistributionorderOk, (_state, data) => ({
    ..._state,
    ...data,
    isLoading: false,
    status: 'postDistributionOrder ok',
  })),

  on(_actions.getlisttreamentdiaries, (_state) => ({ ..._state, isLoading: true, status: 'getListTreamentDiaries' })),
  on(_actions.getlisttreamentdiariesOk, (_state, paginationTreamentDiaries) => ({
    ..._state,
    ...paginationTreamentDiaries,
    isLoading: false,
    status: 'getListTreamentDiaries ok',
  })),

  on(_actions.getlistclaims, (_state) => ({ ..._state, isLoading: true, status: 'getListClaims' })),
  on(_actions.getlistclaimsOk, (_state, paginationClaims) => ({
    ..._state,
    ...paginationClaims,
    isLoading: false,
    status: 'getListClaims ok',
  })),

  on(_actions.getdetailclaims, (_state) => ({
    ..._state,
    isLoading: true,
    status: 'getDetailClaims',
  })),
  on(_actions.getdetailclaimsOk, (_state, dataClaims) => ({
    ..._state,
    ...dataClaims,
    isLoading: false,
    status: 'getDetailClaims ok',
  })),
  on(_actions.getdetailtreamentdiaries, (_state) => ({
    ..._state,
    isLoading: true,
    status: 'getDetailTreamentDiaries',
  })),
  on(_actions.getdetailtreamentdiariesOk, (_state, dataTreamentDiaries) => ({
    ..._state,
    ...dataTreamentDiaries,
    isLoading: false,
    status: 'getDetailTreamentDiaries ok',
  })),
  on(_actions.getpaymenthistory, (_state) => ({ ..._state, isLoading: true, status: 'getPaymentHistory' })),
  on(_actions.getpaymenthistoryOk, (_state, pagination) => ({
    ..._state,
    ...pagination,
    isLoading: false,
    status: 'getPaymentHistory ok',
  })),
  on(_actions.postpaymentsetting, (_state) => ({ ..._state, isLoading: true, status: 'postPaymentSetting' })),
  on(_actions.postpaymentsettingOk, (_state, data) => ({
    ..._state,
    ...data,
    isLoading: false,
    status: 'postPaymentSetting ok',
  })),
  on(_actions.posttranferfarmer, (_state) => ({ ..._state, isLoading: true, status: 'postTranferFarmer' })),
  on(_actions.posttranferfarmerOk, (_state, data) => ({
    ..._state,
    ...data,
    isLoading: false,
    status: 'postTranferFarmer ok',
  })),

  on(_actions.getfeedback, (_state, query) => ({ ..._state, isLoading: true, status: 'getFeedBack', query })),
  on(_actions.getfeedbackOk, (_state, pagination) => ({
    ..._state,
    ...pagination,
    isLoading: false,
    status: 'getFeedBack ok',
  })),

  on(_actions.putapproveclaims, (_state) => ({ ..._state, isLoading: true, status: 'putApproveClaims' })),
  on(_actions.putapproveclaimsOk, (_state, data) => ({
    ..._state,
    ...data,
    isLoading: false,
    status: 'putApproveClaims ok',
  })),

  on(_actions.putrejectclaims, (_state) => ({ ..._state, isLoading: true, status: 'putRejectClaims' })),
  on(_actions.putrejectclaimsOk, (_state, data) => ({
    ..._state,
    ...data,
    isLoading: false,
    status: 'putRejectClaims ok',
  })),

  on(_actions.getfeedbackfarmer, (_state) => ({
    ..._state,
    isLoading: true,
    status: 'getFeedBackFarmer',
  })),
  on(_actions.getfeedbackfarmerOk, (_state, dataFeedBack) => ({
    ..._state,
    ...dataFeedBack,
    isLoading: false,
    status: 'getFeedBackFarmer ok',
  })),
  on(_actions.getfeedbackfarmerError, (_state) => ({
    ..._state,
    dataFeedBack: undefined,
    isLoading: false,
    status: 'getFeedBackFarmer error',
  })),

  on(_actions.getfeedbackclinic, (_state) => ({
    ..._state,
    isLoading: true,
    status: 'getFeedBackClinic',
  })),
  on(_actions.getfeedbackclinicOk, (_state, dataFeedBack) => ({
    ..._state,
    ...dataFeedBack,
    isLoading: false,
    status: 'getFeedBackClinic ok',
  })),
  on(_actions.getfeedbackclinicError, (_state) => ({
    ..._state,
    dataFeedBack: undefined,
    isLoading: false,
    status: 'getFeedBackClinic error',
  })),

  on(_actions.error, (_state) => ({ ..._state, isLoading: true, status: 'error' })),
);

@Injectable()
export class OrdersFacade {
  select = createFeatureSelector<OrdersState>(ORDER_FEATURE_KEY);
  isLoading$ = this.store.select(createSelector(this.select, (state) => state.isLoading));
  status$ = this.store.select(createSelector(this.select, (state) => state.status));

  constructor(private store: Store) {}

  pagination$ = this.store.select(createSelector(this.select, (state) => state.pagination));
  query$ = this.store.select(createSelector(this.select, (state) => state.query));
  get = (query: QueryFilter) => this.store.dispatch(_actions.get(query));
  data$ = this.store.select(createSelector(this.select, (state) => state.data));
  getById = (id: string) => this.store.dispatch(_actions.getbyid({ id }));
  dataProposal$ = this.store.select(createSelector(this.select, (state) => state.dataProposal));
  getListProposalById = (id: string) => this.store.dispatch(_actions.getlistproposalbyid({ id }));

  dataDetailProposal$ = this.store.select(createSelector(this.select, (state) => state.dataDetailProposal));
  getDetailProposalById = (id: string, proposalId: string) =>
    this.store.dispatch(
      _actions.getdetailproposalbyid({
        id,
        proposalId,
      }),
    );
  postApproveOrder = (id: string) => this.store.dispatch(_actions.postapproveorder({ id }));
  postRejectOrder = (id: string, note: string) => this.store.dispatch(_actions.postrejectorder({ id, note }));
  postDistributionOrder = (id: string) => this.store.dispatch(_actions.postdistributionorder({ id }));

  putRejectClaims = (id: string, rejectReason: string) =>
    this.store.dispatch(_actions.putrejectclaims({ id, rejectReason }));
  putApproveClaims = (id: string) => this.store.dispatch(_actions.putapproveclaims({ id }));
  getListTreamentDiaries = (id: string, query: QueryFilter) =>
    this.store.dispatch(_actions.getlisttreamentdiaries({ id, ...query }));
  paginationTreamentDiaries$ = this.store.select(
    createSelector(this.select, (state) => state.paginationTreamentDiaries),
  );
  dataTreamentDiaries$ = this.store.select(createSelector(this.select, (state) => state.dataTreamentDiaries));
  getDetailTreamentDiaries = (id: string) => this.store.dispatch(_actions.getdetailtreamentdiaries({ id }));
  getListClaims = (id: string, query: QueryFilter) => this.store.dispatch(_actions.getlistclaims({ id, ...query }));
  paginationClaims$ = this.store.select(createSelector(this.select, (state) => state.paginationClaims));

  dataClaims$ = this.store.select(createSelector(this.select, (state) => state.dataClaims));
  getDetailClaims = (id: string) => this.store.dispatch(_actions.getdetailclaims({ id }));
  getPaymentHistory = (id: string, query: QueryFilter) =>
    this.store.dispatch(_actions.getpaymenthistory({ id, ...query }));
  paginationPaymentHistory$ = this.store.select(createSelector(this.select, (state) => state.paginationPaymentHistory));

  postPaymentSetting = (id: string, dataPaymentSetting: paymentSettings) =>
    this.store.dispatch(
      _actions.postpaymentsetting({
        id,
        dataPaymentSetting,
      }),
    );
  postTranferFarmer = (id: string, dataTranferFarmer: TranferFarmer) =>
    this.store.dispatch(
      _actions.posttranferfarmer({
        id,
        dataTranferFarmer,
      }),
    );
  id$ = this.store.select(createSelector(this.select, (state) => state.id));
  setId = (id: string | null) => this.store.dispatch(_actions.setId({ id }));

  getFeedBack = (query: QueryFilter) => this.store.dispatch(_actions.getfeedback(query));

  dataFeedBack$ = this.store.select(createSelector(this.select, (state) => state.dataFeedBack));
  getFeedBackFarmer = (id: string) => this.store.dispatch(_actions.getfeedbackfarmer({ id }));
  getFeedBackClinic = (id: string) => this.store.dispatch(_actions.getfeedbackclinic({ id }));

  paginationFeedBack$ = this.store.select(createSelector(this.select, (state) => state.paginationFeedBack));
  // getFeedBack = (id: string, query: QueryFilter) =>
  //   this.store.dispatch(_actions.getfeedback({ id, ...query }));
  // paginationFeedback$ = this.store.select(createSelector(this.select, (state) => state.paginationFeedBack));
}
