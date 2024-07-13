import {isDevMode, NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {BiitCookiesConsentModule, BiitSnackbarModule} from "biit-ui/info";
import {TranslocoRootModule} from "biit-ui/i18n";
import {TRANSLOCO_CONFIG, TRANSLOCO_LOADER, translocoConfig} from "@ngneat/transloco";
import {HeaderInterceptor} from "./config/header-interceptor";
import {registerLocaleData} from "@angular/common";

import localeEn from '@angular/common/locales/en';
import localeEs from '@angular/common/locales/es';
import localeNL from '@angular/common/locales/nl';

registerLocaleData(localeEn, 'en')
registerLocaleData(localeEs, 'es');
registerLocaleData(localeNL, 'nl');

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    HttpClientModule,
    TranslocoRootModule,
    BrowserModule,
    BiitSnackbarModule,
    AppRoutingModule,
    BiitCookiesConsentModule
  ],
  providers: [
    {
      provide: TRANSLOCO_CONFIG,
      useValue: translocoConfig({
        availableLangs: ['en', 'es', 'nl'],
        defaultLang: 'en',
        fallbackLang: 'en',
        reRenderOnLangChange: true,
        prodMode: !isDevMode()
      })
    },
    {provide: HTTP_INTERCEPTORS, useClass: HeaderInterceptor, multi: true}

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
