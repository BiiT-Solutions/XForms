import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AuthGuard} from "./services/auth-guard.service";

const defaultRoute = import('./views/biit-login-page/biit-login-page.module').then(m => m.BiitLoginPageModule);

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./views/form-runner/form-runner.module').then(m => m.FormRunnerModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'preview',
    data: {preview: true},
    loadChildren: () => import('./views/form-runner/form-runner.module').then(m => m.FormRunnerModule)
  },
  {
    path: 'login',
    loadChildren: () => defaultRoute
  },
  {
    path: '**',
    loadChildren: () => defaultRoute
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
