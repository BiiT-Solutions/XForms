import {isDevMode, NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { BiitLoginPageComponent } from './biit-login-page.component';
import {BiitLoginModule} from "biit-ui/login";
import {BiitProgressBarModule} from "biit-ui/info";
import {TranslocoRootModule} from "biit-ui/i18n";
import {BiitLoginPageRoutingModule} from "./biit-login-page-routing.module";
import {TRANSLOCO_CONFIG, TRANSLOCO_LOADER, translocoConfig} from "@ngneat/transloco";
import {TranslocoHttpLoader} from "../../transloco-root.module";
import {HTTP_INTERCEPTORS} from "@angular/common/http";
import {HeaderInterceptor} from "../../config/header-interceptor";



@NgModule({
    declarations: [
        BiitLoginPageComponent
    ],
    exports: [
        BiitLoginPageComponent
    ],
  imports: [
    BiitLoginPageRoutingModule,
    CommonModule,
    BiitLoginModule,
    TranslocoRootModule,
    BiitProgressBarModule
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
  ]
})
export class BiitLoginPageModule { }
