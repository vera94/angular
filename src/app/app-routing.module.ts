import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AccountComponent } from './account/account.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { MapComponent } from './map/map.component';
import { AdminComponent } from './admin/admin.component';
import { UsersComponent } from './users/users.component';
import { FavoritesComponent } from './favorites/favorites.component';

const routes: Routes = [
    { path: 'account', component: AccountComponent },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'login' , component: LoginComponent},
    { path: 'map' , component: MapComponent},
    { path: 'admin' , component: AdminComponent},
    { path: 'users' , component: UsersComponent},
    { path: 'favorites' , component: FavoritesComponent}
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
