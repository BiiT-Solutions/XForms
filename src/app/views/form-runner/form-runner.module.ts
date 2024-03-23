import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormRunnerComponent } from './form-runner.component';
import {FormRunnerRoutingModule} from "./form-runner-routing.module";
import {FormModule} from "x-forms-lib";
import {BiitIconModule} from "biit-ui/icon";
import {BiitProgressBarModule} from "biit-ui/info";



@NgModule({
  declarations: [
    FormRunnerComponent
  ],
  imports: [
    CommonModule,
    FormRunnerRoutingModule,
    FormModule,
    BiitIconModule,
    BiitProgressBarModule
  ]
})
export class FormRunnerModule { }
