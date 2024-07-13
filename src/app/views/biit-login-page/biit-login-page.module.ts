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
  ]
})
export class BiitLoginPageModule { }
