import {RouterModule, Routes} from "@angular/router";
import {BiitLoginPageComponent} from "./biit-login-page.component";
import {NgModule} from "@angular/core";
const routes: Routes = [
  {
    path: '',
    component: BiitLoginPageComponent
  }
]
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BiitLoginPageRoutingModule { }
