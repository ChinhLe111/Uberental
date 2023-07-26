import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { en_US, NZ_I18N } from 'ng-zorro-antd/i18n';
import { LocationStrategy, PathLocationStrategy, registerLocaleData } from '@angular/common';
import { ServiceWorkerModule } from '@angular/service-worker';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { AuthInterceptor } from '@src/app/auth.interceptor';
import { GLOBAL_FEATURE_KEY, globalReducer, GlobalEffects } from '@store';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import en from '@angular/common/locales/en';
registerLocaleData(en);

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    StoreModule.forRoot({ [GLOBAL_FEATURE_KEY]: globalReducer }),
    EffectsModule.forRoot([GlobalEffects]),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: LocationStrategy, useClass: PathLocationStrategy },
    { provide: NZ_I18N, useValue: en_US },
  ],
  exports: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
