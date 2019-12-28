import { Injectable } from '@angular/core';
import { HttpClient , HttpHeaders, HttpResponse } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
    loginUrl = 'http://localhost:8080/travelAssistant/login';
    result;
    token;

  constructor(private http: HttpClient, private cookieService: CookieService) { }

  getGreetingMessage() {
    //   {responseType: 'text'}
    let username = 'admin';
    let password = 'password';

    this.http.post<any>(this.loginUrl, { "email": username, "password" : password }, {
      headers: new HttpHeaders({'Content-Type': 'text/plain'}),
      observe: 'response'
    }).subscribe( 
    (response : HttpResponse<any> ) => { 
  		const header = response.headers.get('Authorization');
        console.log(header);
        this.cookieService.set("jwt", header);
        }
    );
    return this.result;
    //   return "hello world";
  }
}
