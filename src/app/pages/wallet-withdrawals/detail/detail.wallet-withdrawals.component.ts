import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewEncapsulation,
} from '@angular/core';

import { DataTableModel, FormModel } from '@model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  AttachmentTemplate,
  UploadFacade,
  User,
  WalletSms,
  WalletSmsFacade,
  WalletWithDrawals,
  WalletWithDrawalsFacade,
} from '@store';
import { ListColorStatus } from '../../wallet-deposits/model-status';
import { Subject, takeUntil, withLatestFrom } from 'rxjs';
// @ts-ignore
import GLightbox from 'glightbox';

@Component({
  selector: 'app-detail-wallet-withdrawals',
  templateUrl: './detail.wallet-withdrawals.component.html',
  styleUrls: ['./detail.wallet-withdrawals.component.less'],
  providers: [WalletWithDrawalsFacade, WalletSmsFacade, UploadFacade],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailWalletWithdrawalsComponent implements OnInit, OnDestroy {
  @Input() user?: User;
  @Input() withdrawalsId = '';
  @Input() isVisible!: boolean;
  @Output() handleCancel = new EventEmitter();

  protected readonly listColorStatus = ListColorStatus;

  // isVisibleDetail = false;
  //
  // infoUpload: any;
  // urlUpload: any;
  // listUpload = [];
  // previewImage: any;
  // previewVisible = false;

  constructor(
    private fb: FormBuilder,
    public walletWithDrawalsFacade: WalletWithDrawalsFacade,
    private walletSmsFacade: WalletSmsFacade,
    public uploadFacade: UploadFacade,
  ) {}

  private destroyed$ = new Subject<void>();
  detail?: WalletWithDrawals & { messages: WalletSms[] };

  // ngOnChanges(changes: SimpleChanges): void {
  //   if (changes.isVisible) {
  //     if (changes.isVisible.currentValue) {
  //       this.isVisibleDetail = false;
  //       this.walletWithDrawalsFacade.dataAttachmentsTemplate$.pipe(takeUntil(this.destroyed$)).subscribe((res) => {
  //         if (res) {
  //           this.infoUpload = res[0];
  //           this.urlUpload =
  //             environment.apiUrl +
  //             '/api/v1/core/nodes/upload/physical/blob?destinationPhysicalPath=' +
  //             this.infoUpload.prefix;
  //         }
  //       });
  //       this.walletWithDrawalsFacade.data$.pipe(takeUntil(this.destroyed$)).subscribe({
  //         next: (res) => {
  //           if (res) {
  //             if (this.user?.level! > 8) {
  //               this.walletSmsFacade.get({ filter: JSON.stringify({ fullTextSearch: res?.transferContent }) });
  //               this.walletSmsFacade.pagination$.pipe(takeUntil(this.destroyed$)).subscribe((data) => {
  //                 this.tableMessages();
  //                 this.detail = { ...res, messages: data.content };
  //               });
  //             } else {
  //               this.tableMessages();
  //               this.detail = { ...res, messages: [] };
  //               this.isVisibleDetail = true;
  //             }
  //           }
  //         },
  //         error: () => this.handleCancelDetail(),
  //       });
  //     } else {
  //       if (this.isVisibleDetail) {
  //         this.handleCancelDetail();
  //       }
  //     }
  //   }
  // }

  formUpload!: FormGroup;
  templateUpload: AttachmentTemplate[] = [];

  private buildFormUpload() {
    const obj: any = {};
    this.templateUpload.forEach((item) => {
      obj[item.docType] = [null, Validators.required];
    });
    this.formUpload = this.fb.group(obj);
  }

  ngOnInit(): void {
    this.uploadFacade.attachmentTemplates$
      .pipe(takeUntil(this.destroyed$), withLatestFrom(this.uploadFacade.entityType$))
      .subscribe(([templateUpload, entityType]) => {
        if (templateUpload.length > 0 && entityType === 'wallet') {
          this.templateUpload = templateUpload;
          this.buildFormUpload();
        } else this.uploadFacade.getAttachmentTemplates('wallet');
      });
    this.walletWithDrawalsFacade.data$.pipe(takeUntil(this.destroyed$)).subscribe((data) => {
      if (data?.attachments) {
        const templateWithdrawals: { [docType: string]: any } = {};
        for (const key of this.templateUpload) {
          templateWithdrawals[key.docType] = data.attachments.filter((item) => item.docType == key.docType);
        }
        this.formUpload.reset(templateWithdrawals);
        setTimeout(() => {
          GLightbox();
        }, 300);
      }
    });
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  changeUpload(validateForm: FormGroup) {
    if (validateForm.value) {
      const data: {
        id: string;
        description: string;
      }[] = [];
      for (const attachment of this.templateUpload) {
        if (validateForm.value[attachment.docType]) {
          validateForm.value[attachment.docType].map((item: any) => {
            data.push({ id: item.id, description: item.description });
          });
        }
      }
      this.walletWithDrawalsFacade.postAttachmentsMany(this.withdrawalsId, data);
    }
  }

  handleCancelDetail(): void {
    this.handleCancel.emit();
  }

  isVisibleCancel = false;
  cancelId = '';

  handleOkModal(validateForm: FormGroup): void {
    if (validateForm.status === 'VALID') {
      this.isVisibleCancel = false;
      this.walletWithDrawalsFacade.putCancel(this.cancelId, validateForm.value.cancelReason);
      this.walletWithDrawalsFacade.status$.pipe(takeUntil(this.destroyed$)).subscribe((status) => {
        switch (status) {
          case 'putCancelOk':
            this.handleCancelDetail();
            break;
        }
      });
    }
  }

  handleCancelModal(): void {
    this.isVisibleCancel = false;
  }

  handleStatus(status: string, data: WalletWithDrawals): void {
    switch (status) {
      case 'CANCEL':
        this.cancelId = data.id;
        this.isVisibleCancel = true;
        break;
      case 'COMPLETE':
        this.walletWithDrawalsFacade.putComplete(data.id, []);
        this.handleCancelDetail();
        break;
      case 'CONFIRM_TRANSFERRED':
        this.walletWithDrawalsFacade.putConfirmTransferred(data.id);
        this.handleCancelDetail();
        break;
    }
  }

  columnsCancel: FormModel[] = [
    {
      name: 'cancelReason',
      title: 'routes.admin.wallet.reason_for_cancellation',
      formItem: {
        type: 'textarea',
      },
    },
  ];
  columnsMessages: DataTableModel<any>[] = [];

  private tableMessages() {
    setTimeout(() => {
      this.columnsMessages = [
        {
          name: 'phoneNumber',
          title: 'routes.admin.wallet.phone',
          tableItem: {
            width: '120px',
          },
        },
        {
          name: 'amount',
          title: 'routes.admin.wallet.money_amount',
          tableItem: {
            width: '90px',
          },
        },
        {
          name: 'matched',
          title: 'routes.admin.wallet.order_matching',
          tableItem: {
            width: '80px',
            render: (data) =>
              `<i class="las la-lg la-${
                data.matched ? 'check-circle text-green-600' : 'times-circle text-red-600'
              }"></i>`,
          },
        },
        {
          name: 'content',
          title: 'routes.admin.wallet.content',
          tableItem: {},
        },
      ];
    });
  }
}
