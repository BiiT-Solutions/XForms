import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormRunnerComponent } from './form-runner.component';
import {FormRunnerRoutingModule} from "./form-runner-routing.module";
import {FormModule} from "@biit-solutions/x-forms-lib";
import {BiitIconModule} from "@biit-solutions/wizardry-theme/icon";
import {BiitProgressBarModule} from "@biit-solutions/wizardry-theme/info";
import {BiitPopupModule} from "@biit-solutions/wizardry-theme/popup";
import {BiitButtonModule} from "@biit-solutions/wizardry-theme/button";
import {TranslocoRootModule} from "@biit-solutions/wizardry-theme/i18n";



@NgModule({
  declarations: [
    FormRunnerComponent
  ],
  imports: [
    CommonModule,
    FormRunnerRoutingModule,
    FormModule,
    BiitIconModule,
    BiitProgressBarModule,
    BiitPopupModule,
    BiitButtonModule,
    TranslocoRootModule
  ]
})
export class FormRunnerModule { }
