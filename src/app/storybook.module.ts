import { TranslateModule, TranslateService, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { LOCALE_ID, NgModule } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule, registerLocaleData } from '@angular/common';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, '../assets/translations/', '.json');
}
import localeEn from '@angular/common/locales/en';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
registerLocaleData(localeEn);

@NgModule({
  declarations: [],
  imports: [
    HttpClientModule,
    CommonModule,
    NoopAnimationsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
  exports: [TranslateModule],
  providers: [{ provide: LOCALE_ID, useValue: 'en' }],
})
export class StorybookModule {
  constructor(translate: TranslateService) {
    translate.setDefaultLang('en');
    translate.use('en');
  }
}
