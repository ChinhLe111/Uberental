import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { NzSelectModule } from 'ng-zorro-antd/select';

import { AuthLayout } from '@layouts';
import { GFormModule } from '@core';
import { RegisterComponent, LoginComponent, ForgotPassComponent } from '@pages';
import { environment } from '@src/environments/environment';

import { AuthRouting } from './auth.routing';

@NgModule({
  declarations: [AuthLayout, LoginComponent, RegisterComponent, ForgotPassComponent],
  imports: [
    CommonModule,
    AuthRouting,
    HttpClientModule,
    TranslateModule.forRoot({
      defaultLanguage: localStorage.getItem('ng-language') || environment.language,
      loader: {
        provide: TranslateLoader,
        useFactory: function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
          return new TranslateHttpLoader(http, 'assets/translations/');
        },
        deps: [HttpClient],
      },
    }),
    GFormModule,
    FormsModule,
    ReactiveFormsModule,
    NzSelectModule,
  ],
  providers: [],
})
export class AuthModule {}
