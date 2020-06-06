import { Injectable } from '@angular/core';
import { HttpClient , HttpHeaders, HttpResponse } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
	appUrl = 'http://localhost:8585/travelAssistant';
    loginUrl = this.appUrl + '/login';
    logoutUrl = this.appUrl + '/logout';
    getUrl = this.appUrl + '/user/';
    signUpUrl = this.appUrl + '/user/signup';
    editUserUrl = this.appUrl + '/user/update';
    result;
    token;

  constructor(private http: HttpClient, private cookieService: CookieService) { }

  logIn(email, password) {
 	 var that = this;
 	return new Promise(function(resolve, reject) {
	    that.http.post(that.loginUrl, { "email": email, "password" : password }, {
	      headers: new HttpHeaders({'Content-Type': 'text/plain'}),
	      observe: 'response'
	    }).subscribe( 
	    (response : HttpResponse<any> ) => {
	    	if( response.status == 200) {
		  		const header = response.headers.get('Authorization');
		  		const userRole = response.headers.get('role');
		        that.cookieService.set("jwt", header);
		        that.cookieService.set("email", email);
		        that.cookieService.set("role", userRole);
		        resolve();
	        } else {
	        	reject();
	        }
	        }
	    );
    });
  }
  
  logOut() {
 	 var that = this;
	  	 	return new Promise(function(resolve, reject) {
		  		that.http.post<any>(that.logoutUrl, {}, {
			      headers: new HttpHeaders().set('Authorization', that.cookieService.get("jwt")),
			      observe: 'response'
			    }).subscribe( 
			    (response : HttpResponse<any> ) => { 
			  		const status = response.status;
			  		if(status == 200){
			  			that.cookieService.deleteAll();
			 			resolve();
		 			} else {
		 				reject();
		 			}
	        });
	    });
  }
  
    signUp(user : User) {
    	var that = this;
  	 	return new Promise(function(resolve, reject) {
		    that.http.post(that.signUpUrl, user, {
		      headers: new HttpHeaders({'Content-Type': 'application/json'}),
		      observe: 'response'
		    }).subscribe( 
			    (response : HttpResponse<any> ) => {
			    	if(response.status == 200 ){ 
			  			resolve();
			  		} else {
			  			reject();
			  		}
		        });
        });
  	}
  	
  	updateUser(user : User) {
  		var that = this;
	  	 	return new Promise(function(resolve, reject) {
		  		that.http.put<any>(that.getUrl, user, {
			      headers: new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', that.cookieService.get("jwt")),
			      observe: 'response'
			    }).subscribe( 
			    (response : HttpResponse<any> ) => { 
			  		const status = response.status;
			  		if(status == 200){
			 			resolve();
		 			} else {
		 				reject();
		 			}
	        });
	    });
  	}
  	
  	getCurrentUserData() {
  		var that = this;
  	 	return new Promise(function(resolve, reject) {
	  	that.http.get<User>(that.getUrl, {
		      headers: new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', that.cookieService.get("jwt")),
		      observe: 'response'
		    }).subscribe( 
		    (response : HttpResponse<User> ) => { 
		    		if(response.status == 200 ){ 
			  			resolve(response.body);
			  		} else {
			  			reject();
			  		}
	        });
	    });
  	}
}

export interface User {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  prefferedLandmarkTypes : [];
}
