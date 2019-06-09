import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AccountComponent } from './account/account.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
    { path: 'account', component: AccountComponent },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'login' , component: LoginComponent}
];


@NgModule({
  imports: [RouterModule.forRoot(routes,
      {
        enableTracing: false
      }
    )],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
