import { Component , ChangeDetectorRef, ChangeDetectionStrategy, ViewChild} from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { UserService, User } from './user.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
title = 'angular';
  isLoggedUser = !!this.cookieService.get("email");
	constructor(private cookieService: CookieService, public changeDetectorRef :ChangeDetectorRef, 
		private userService : UserService , private router : Router) {
    setInterval(() => {
      this.isLoggedUser = !!this.cookieService.get("email");
      // require view to be updated
      this.changeDetectorRef.markForCheck();
    }, 1000);
  }
  
  logOut(){
  	var that = this;
		 var promise = this.userService.logOut().then(function(){
		  		that.router.navigate(['']);
		  });
	}
	
}
