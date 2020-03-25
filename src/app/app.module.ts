import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AccountComponent } from './account/account.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MatListModule, MatSidenavModule, MatToolbarModule, MatExpansionModule, MatTableModule,
     MatInputModule, MatIconModule, MatSelectModule, MatGridListModule, MatCardModule, MatDialogModule } from '@angular/material';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './login/login.component';
import {MatFormFieldModule} from '@angular/material/form-field';
import { CookieService } from 'ngx-cookie-service';
import { MapComponent } from './map/map.component';
import { AdminComponent, AddEntityDialog } from './admin/admin.component';
import {MatSortModule} from '@angular/material/sort';


@NgModule({
  declarations: [
    AppComponent,
    AccountComponent,
    DashboardComponent,
    LoginComponent,
    MapComponent,
    AdminComponent,
    AddEntityDialog
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatIconModule,
    MatSelectModule,
    MatSortModule,
     MatGridListModule,
     MatCardModule,
     MatTableModule,
    MatDialogModule
     
  ],
  providers: [CookieService],
  bootstrap: [AppComponent],
  entryComponents: [AdminComponent, AddEntityDialog],
})
export class AppModule { }
