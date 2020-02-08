import { Injectable } from '@angular/core';
import { HttpClient , HttpHeaders, HttpResponse } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
	appUrl = 'http://localhost:8080/travelAssistant';
    loginUrl = this.appUrl + '/login';
    signUpUrl = this.appUrl + '/user/signup';
    editUserUrl = this.appUrl + '/user/update';
    result;
    token;

  constructor(private http: HttpClient, private cookieService: CookieService) { }

  getJWToken(username, password) {
    this.http.post<any>(this.loginUrl, { "email": username, "password" : password }, {
      headers: new HttpHeaders({'Content-Type': 'text/plain'}),
      observe: 'response'
    }).subscribe( 
    (response : HttpResponse<any> ) => { 
  		const header = response.headers.get('Authorization');
        console.log(header);
        this.cookieService.set("jwt", header);
        this.cookieService.set("user", username);
        }
    );
  }
  
    signUp(username, password) {
	    this.http.post<any>(this.signUpUrl, { "email": username, "password" : password }, {
	      headers: new HttpHeaders({'Content-Type': 'application/json'}),
	      observe: 'response'
	    }).subscribe( 
	    (response : HttpResponse<any> ) => { 
	  		const status = response.status;
	        }
	    );
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
}
