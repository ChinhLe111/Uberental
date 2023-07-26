import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminLayout } from '@layouts';
import {
  DashboardComponent,
  PostsComponent,
  EditCategoryPostComponent,
  EditPostComponent,
  NavigationComponent,
  ParameterComponent,
  DataComponent,
  EditDataComponent,
  EditTypeDataComponent,
  CodeTypesComponent,
  EditProfileComponent,
  EditCodeTypeComponent,
  AccountComponent,
  PasswordAccountComponent,
  EditAccountComponent,
  DetailAccountComponent,
  AddressComponent,
  ClinicsComponent,
  EditClinicComponent,
  DetailClinicComponent,
  EscrowMoneyComponent,
  EscrowListComponent,
  DetailEscrowListComponent,
  EscrowWithdrawalListComponent,
  DetailEscrowWithdrawalListComponent,
  MedicalProcedureComponent,
  DetailMedicalProcedureComponent,
  EditMedicalProcedureComponent,
  EditProvinceCommissionComponent,
  ProfileFarmerComponent,
  EditProfileFarmerComponent,
  DetailProfileFarmerComponent,
  WalletListsComponent,
  WalletDepositsComponent,
  WalletWithdrawalsComponent,
  WalletSmsComponent,
  DetailWalletListComponent,
  CustomerManagementComponent,
  OrderComponent,
  DetailOrderComponent,
  DetailProposalOrderComponent,
  DetailTreamentDiariesComponent,
  ClaimsOrderComponent,
  DetailClaimsComponent,
  ChangeFarmerComponent,
  PaymentContentComponent,
  PaymentHistoryComponent,
  PaymentSettingsComponent,
  FeedbackComponent,
  DetailFeedbackComponent,
  ClinicFeedbackComponent,
  FarmerFeedbackComponent,
} from '@pages';

const routes: Routes = [
  {
    path: '',
    component: AdminLayout,
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
      },
      {
        path: 'post',
        component: PostsComponent,
      },
      {
        path: 'navigation',
        component: NavigationComponent,
      },
      {
        path: 'post/:id/edit',
        component: EditPostComponent,
      },
      {
        path: 'post/add',
        component: EditPostComponent,
      },
      {
        path: 'post/categories/:id/edit',
        component: EditCategoryPostComponent,
      },
      {
        path: 'post/categories/add',
        component: EditCategoryPostComponent,
      },
      {
        path: 'data',
        component: DataComponent,
      },
      {
        path: 'data/add',
        component: EditDataComponent,
      },
      {
        path: 'data/:id/edit',
        component: EditDataComponent,
      },
      {
        path: 'data/type/add',
        component: EditTypeDataComponent,
      },
      {
        path: 'data/type/:id/edit',
        component: EditTypeDataComponent,
      },
      {
        path: 'edit-profile',
        component: EditProfileComponent,
      },
      {
        path: 'code-types',
        component: CodeTypesComponent,
      },
      {
        path: 'code-types/:type/add',
        component: EditCodeTypeComponent,
      },
      {
        path: 'code-types/:type/:id/edit',
        component: EditCodeTypeComponent,
      },
      {
        path: 'code-types/escrow-money/edit',
        component: EscrowMoneyComponent,
      },
      {
        path: 'parameter',
        component: ParameterComponent,
      },
      {
        path: 'customer-account',
        component: AccountComponent,
      },
      {
        path: 'customer-account/add',
        component: EditAccountComponent,
      },
      {
        path: 'customer-account/:id',
        component: DetailAccountComponent,
      },
      {
        path: 'customer-account/:id/edit',
        component: EditAccountComponent,
      },
      {
        path: 'customer-account/:id/password',
        component: PasswordAccountComponent,
      },
      {
        path: 'internal-account',
        component: AccountComponent,
      },
      {
        path: 'internal-account/add',
        component: EditAccountComponent,
      },
      {
        path: 'internal-account/:id',
        component: DetailAccountComponent,
      },
      {
        path: 'internal-account/:id/edit',
        component: EditAccountComponent,
      },
      {
        path: 'internal-account/:id/password',
        component: PasswordAccountComponent,
      },
      {
        path: 'address',
        component: AddressComponent,
      },
      {
        path: 'clinics',
        component: ClinicsComponent,
      },
      {
        path: 'clinics/edit/:id',
        component: EditClinicComponent,
      },
      {
        path: 'clinics/detail/:id',
        component: DetailClinicComponent,
      },
      {
        path: 'escrow-list',
        component: EscrowListComponent,
      },
      {
        path: 'escrow-list/:id/:profileType',
        component: DetailEscrowListComponent,
      },
      {
        path: 'escrow-withdrawal-list',
        component: EscrowWithdrawalListComponent,
      },
      {
        path: 'escrow-withdrawal-list/:id/:profileType',
        component: DetailEscrowWithdrawalListComponent,
      },
      {
        path: 'medical-procedure',
        component: MedicalProcedureComponent,
      },
      {
        path: 'medical-procedure/detail/:id',
        component: DetailMedicalProcedureComponent,
      },
      {
        path: 'medical-procedure/edit',
        component: EditMedicalProcedureComponent,
      },
      {
        path: 'medical-procedure/province-commission/edit',
        component: EditProvinceCommissionComponent,
      },
      {
        path: 'medical-procedure/edit/:id',
        component: EditMedicalProcedureComponent,
      },
      {
        path: 'profile-farmer',
        component: ProfileFarmerComponent,
      },
      {
        path: 'profile-farmer/:id/edit',
        component: EditProfileFarmerComponent,
      },
      {
        path: 'profile-farmer/:id',
        component: DetailProfileFarmerComponent,
      },
      {
        path: 'wallet-list',
        component: WalletListsComponent,
      },
      {
        path: 'wallet-list/:id',
        component: DetailWalletListComponent,
      },
      {
        path: 'wallet-deposits',
        component: WalletDepositsComponent,
      },
      {
        path: 'wallet-withdrawals',
        component: WalletWithdrawalsComponent,
      },
      {
        path: 'wallet-sms',
        component: WalletSmsComponent,
      },
      {
        path: 'customer-management',
        component: CustomerManagementComponent,
      },
      {
        path: 'order',
        component: OrderComponent,
      },
      {
        path: 'order/:id',
        component: DetailOrderComponent,
      },
      {
        path: 'order/:id/proposal/:proposalId',
        component: DetailProposalOrderComponent,
      },
      {
        path: 'order/:id/treamentDiaries/:idTreament',
        component: DetailTreamentDiariesComponent,
      },
      {
        path: 'order/:id/claims',
        component: ClaimsOrderComponent,
      },
      {
        path: 'order/:id/claims/:idClaim',
        component: DetailClaimsComponent,
      },
      {
        path: 'order/:id/changeFarmer',
        component: ChangeFarmerComponent,
      },
      {
        path: 'order/:id/paymentContent',
        component: PaymentContentComponent,
      },
      {
        path: 'order/:id/paymentHistory',
        component: PaymentHistoryComponent,
      },
      {
        path: 'order/:id/paymentSetting',
        component: PaymentSettingsComponent,
      },
      {
        path: 'feedback',
        component: FeedbackComponent,
      },
      {
        path: 'feedback/detail/:id',
        component: DetailFeedbackComponent,
      },
      {
        path: 'feedback/:id/feedback-farmer',
        component: FarmerFeedbackComponent,
      },
      {
        path: 'feedback/:id/feedback-clinic',
        component: ClinicFeedbackComponent,
      },
      { path: '**', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRouting {}
