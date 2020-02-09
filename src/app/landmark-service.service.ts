import { Injectable, ChangeDetectorRef } from '@angular/core';
import { HttpClient , HttpHeaders, HttpResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LandmarkServiceService {
	appUrl = 'http://localhost:8080/travelAssistant';
    getAllUrl = this.appUrl + '/landmark/all';
    addUrl = this.appUrl + '/landmark';
	constructor(private http: HttpClient) { }
    
    getAllLandmarks(data, changeDetectorRef : ChangeDetectorRef) {
     this.http.get<Landmark[]>(this.getAllUrl, {
      headers: new HttpHeaders({'Content-Type': 'application/json'}),
      observe: 'response'
    }).subscribe((response : HttpResponse<Landmark[]>) => {
             data.data = response.body;
             changeDetectorRef.detectChanges();
            } );
	}
  
  	 addLandmark(data) {
     this.http.post(this.addUrl, data, {
      headers: new HttpHeaders({'Content-Type': 'application/json'}),
      observe: 'response'
    }).subscribe((response : HttpResponse<any>) => {
             
            } );
	}
}

export interface Landmark {
  id: number,	
  name: string;
  description: string;
  lat: number;
  lng: number;
  photoUrl: string;
}
