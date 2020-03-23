import { Injectable, ChangeDetectorRef } from '@angular/core';
import { HttpClient , HttpHeaders, HttpResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LandmarkServiceService {
	appUrl = 'http://localhost:8585/travelAssistant';
    getAllUrl = this.appUrl + '/landmark/all';
    addUrl = this.appUrl + '/landmark';
    deleteUrl = this.appUrl + '/landmark/delete/';
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
  
  	 addLandmark(data, isEdit) {
  		var fd = new FormData();
  		var blob = new Blob([JSON.stringify(data.landmark, null, 2)], {type : 'application/json'});
  		fd.append("landmark", blob);
  		fd.append("photo", data.photo);
  		if(isEdit){
  			this.http.put(this.addUrl, fd, {}).subscribe( );
  		} else {  		
	    	this.http.post(this.addUrl, fd, {}).subscribe( );
	    }
	}
	
	deleteLandmark(id) {
     this.http.delete(this.deleteUrl + id, {
      headers: new HttpHeaders({'Content-Type': 'application/json'}),
      observe: 'response'
    }).subscribe((response : HttpResponse<any>) => {
             console.log(response);
            } );
	}
}

export interface Landmark {
  id: number,	
  name: string;
  description: string;
  lat: number;
  lng: number;
  photo: any;
}
