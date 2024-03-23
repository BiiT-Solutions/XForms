import {RouterModule, Routes} from "@angular/router";
import {FormRunnerComponent} from "./form-runner.component";
import {NgModule} from "@angular/core";

const routes: Routes = [
  {
    path: '',
    component: FormRunnerComponent
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FormRunnerRoutingModule { }
