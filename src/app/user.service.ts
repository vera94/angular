import { Injectable } from '@angular/core';
import { HttpClient , HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {
    greetingUrl = 'http://localhost:8080/travelAssistant/';
    result;

  constructor(private http: HttpClient) { }

  getGreetingMessage() {
    //   {responseType: 'text'}
    let username = 'user';
    let password = 'password';

    const headers = new HttpHeaders({ Authorization: 'Basic ' + btoa(username + ':' + password) });
    this.http.get(this.greetingUrl, {responseType: 'text', headers}).subscribe( resultw => this.result = resultw);
    return this.result;
    //   return "hello world";
  }
}
