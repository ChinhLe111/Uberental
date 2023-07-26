import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { DraggableComponent } from './draggable.component';

@NgModule({
  declarations: [DraggableComponent],
  exports: [DraggableComponent],
  imports: [
    CommonModule,
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
  ],
})
export class GDraggableModule {}
