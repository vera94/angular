import { Injectable, ChangeDetectorRef } from '@angular/core';
import { HttpClient , HttpHeaders, HttpResponse } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class LandmarkServiceService {
	appUrl = 'http://localhost:8585/travelAssistant';
    getAllUrl = this.appUrl + '/landmark/all';
    addUrl = this.appUrl + '/landmark';
    deleteUrl = this.appUrl + '/landmark/delete/';
    getLandmarkTypesUrl = this.appUrl + '/landmark/types';
    
	constructor(private http: HttpClient, private cookieService: CookieService) { }
    
    getAllLandmarks(data, changeDetectorRef : ChangeDetectorRef) {
    	var that = this;
  	 	return new Promise(function(resolve, reject) {
		     that.http.get<Landmark[]>(that.getAllUrl, {
		      headers: new HttpHeaders({'Content-Type': 'application/json'}).set('Authorization', that.cookieService.get("jwt")),
		      observe: 'response'
		     }).subscribe((response : HttpResponse<Landmark[]>) => {
		             data.data = response.body;
		             resolve();
		             if(!!changeDetectorRef) {
		             	changeDetectorRef.detectChanges();
		             }
		            } );
        });
	}
  
	  getLandmarkTypes(data) {
	    	var that = this;
	  	 	return new Promise(function(resolve, reject) {
			     that.http.get<LandmarkType[]>(that.getLandmarkTypesUrl, {
			      headers: new HttpHeaders({'Content-Type': 'application/json'}).set('Authorization', that.cookieService.get("jwt")),
			      observe: 'response'
			     }).subscribe((response : HttpResponse<LandmarkType[]>) => {
			             data = response.body;
			             resolve(data);
			            } );
	        });
		}
  
  	 addLandmark(data, isEdit) {
  	 	var that = this;
  	 	return new Promise(function(resolve, reject) {
	  		var fd = new FormData();
	  		var blob = new Blob([JSON.stringify(data.landmark, null, 2)], {type : 'application/json'});
	  		fd.append("landmark", blob);
	  		fd.append("photo", data.photo);
	  		if(isEdit){
	  			that.http.put(that.addUrl, fd, {
	  			 headers: new HttpHeaders().set('Authorization', that.cookieService.get("jwt"))}).subscribe((data: any) =>{
				    if(data){
				      resolve();
				    }
				    else{
				      reject()
				    } });
	  		} else {  		
		    	that.http.post(that.addUrl, fd, {
		    	headers: new HttpHeaders().set('Authorization', that.cookieService.get("jwt"))})
		    	.subscribe((result: any) =>{
				    if(result){
				      resolve();
				    }
				    else{
				      reject()
				    } });
		    }
	    });
	}
	
	deleteLandmark(id) {
		var that = this;
  	 	return new Promise(function(resolve, reject) {
		     that.http.delete(that.deleteUrl + id, {
		      headers: new HttpHeaders({'Content-Type': 'application/json'}).set('Authorization', that.cookieService.get("jwt")),
		      observe: 'response'
		    }).subscribe((data : HttpResponse<any>) => {
	            	if(data){
				      resolve();
				    }
				    else{
				      reject()
			        }
	            } );
        });
	}
}

export interface Landmark {
  id: number,	
  name: string;
  description: string;
  lat: number;
  lng: number;
  rating: number;
  type: string;
  landmarkTypeName : string;
  photo: any;
}

export interface LandmarkType {
  key: string,	
  value: string;
}


