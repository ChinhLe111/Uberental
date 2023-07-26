import { Story, Meta } from '@storybook/angular/types-6-0';
import { moduleMetadata } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { ModalComponent } from './modal.component';
export default {
  title: 'Example/Modal',
  component: ModalComponent,
  decorators: [
    moduleMetadata({
      imports: [CommonModule, NzModalModule],
    }),
  ],
  args: {},
} as Meta;

const Template: Story<ModalComponent> = (args: ModalComponent) => ({
  props: args,
  template: `
            <button (click)="isVisible = true"><i class="las la-edit text-xl text-blue-500"></i></button>
            <g-modal
              [visible]="isVisible"
              [title]="title"
              (clickCancel)="isVisibleDetail = false"
              [loading]="isLoading"
              [contentModal]="contentModalDetail"
              [notFooter]="true"
              [width]="700"
            >
              <ng-template #contentModalDetail>
                <div>template</div>
              </ng-template>
            </g-modal>`,
});
export const Default = Template.bind({});
