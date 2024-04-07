import {isDevMode, NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {BiitCookiesConsentModule, BiitSnackbarModule} from "biit-ui/info";
import {TranslocoRootModule} from "biit-ui/i18n";
import {TRANSLOCO_CONFIG, TRANSLOCO_LOADER, translocoConfig} from "@ngneat/transloco";
import {TranslocoHttpLoader} from "./transloco-root.module";
import {HeaderInterceptor} from "./config/header-interceptor";


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
    { provide: TRANSLOCO_LOADER, useClass: TranslocoHttpLoader },
    {provide: HTTP_INTERCEPTORS, useClass: HeaderInterceptor, multi: true}

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
