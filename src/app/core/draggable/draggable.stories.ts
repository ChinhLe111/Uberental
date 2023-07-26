import { Story, Meta } from '@storybook/angular/types-6-0';
import { moduleMetadata } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { DraggableComponent } from './draggable.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

export default {
  title: 'Example/Draggable',
  component: DraggableComponent,
  decorators: [
    moduleMetadata({
      imports: [
        TranslateModule.forRoot({
          defaultLanguage: localStorage.getItem('ng-language') || 'en',
          loader: {
            provide: TranslateLoader,
            useFactory: function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
              return new TranslateHttpLoader(http, 'assets/translations/');
            },
            deps: [HttpClient],
          },
        }),
        CommonModule,
        HttpClientModule,
      ],
    }),
  ],
  args: {
    listData: [{ name: 123 }],
  },
} as Meta;

const Template: Story<DraggableComponent> = (args: DraggableComponent) => ({
  props: args,
  template: `<g-draggable [listData]="listData"></g-draggable>`,
});
export const Default = Template.bind({});
