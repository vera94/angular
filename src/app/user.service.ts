import { Injectable } from '@angular/core';
import { HttpClient , HttpHeaders, HttpResponse } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
	appUrl = 'http://localhost:8585/travelAssistant';
    loginUrl = this.appUrl + '/login';
    getUrl = this.appUrl + '/user';
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
	    	if( response.status = 200) {
		  		const header = response.headers.get('Authorization');
		        that.cookieService.set("jwt", header);
		        that.cookieService.set("email", email);
		        resolve();
	        } else {
	        	reject();
	        }
	        }
	    );
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
  	
  	update(username, password) {
	  	this.http.post<any>(this.editUserUrl, { "email": username, "password" : password }, {
		      headers: new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', this.cookieService.get("jwt")),
		      observe: 'response'
		    }).subscribe( 
		    (response : HttpResponse<any> ) => { 
		  		const status = response.status;
		        }
		    );
  	}
  	
  	getCurrentUserData() {
  		var email = that.cookieService.get("email");
	  	this.http.get<User>(this.getUrl + '/' + email, {
		      headers: new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', this.cookieService.get("jwt")),
		      observe: 'response'
		    }).subscribe( 
		    (response : HttpResponse<any> ) => { 
		  		const status = response.status;
		        }
		    );
  	}
}

export interface User {
  id: number,	
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}
