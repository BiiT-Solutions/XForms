import {NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { BiitLoginPageComponent } from './biit-login-page.component';
import {BiitLoginModule} from "@biit-solutions/wizardry-theme/login";
import {BiitProgressBarModule} from "@biit-solutions/wizardry-theme/info";
import {TranslocoRootModule} from "@biit-solutions/wizardry-theme/i18n";
import {BiitLoginPageRoutingModule} from "./biit-login-page-routing.module";



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
