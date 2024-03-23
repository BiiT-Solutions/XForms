import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const defaultRoute = import('./views/form-runner/form-runner.module').then(m => m.FormRunnerModule);

const routes: Routes = [
  {
    path: '',
    loadChildren: () => defaultRoute
  },
  {
    path: '**',
    loadChildren: () => defaultRoute
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
