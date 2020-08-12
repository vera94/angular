import { Injectable, ChangeDetectorRef } from '@angular/core';
import { HttpClient , HttpHeaders, HttpResponse } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class LandmarkServiceService {
	appUrl = 'http://localhost:8585/travelAssistant';
    getAllUrl = this.appUrl + '/landmark/all';
    getDBLandmarksUrl = this.appUrl + '/landmark/dblandmarks';
    addUrl = this.appUrl + '/landmark';
    deleteUrl = this.appUrl + '/landmark/delete/';
    getLandmarkTypesUrl = this.appUrl + '/types/all';
    getLandmarkTypesListUrl = this.appUrl + '/types/list';
    getGmapTypesUrl = this.appUrl + '/types/gmap';
    addTypeUrl = this.appUrl + '/types';
    deleteTypeUrl = this.appUrl + '/types/delete/';
    getDirectionsUrl = this.appUrl + '/directions';
    saveSearchUrl = this.getDirectionsUrl + '/request';
    getSavedSearchesUrl = this.getDirectionsUrl + '/requests';
    deleteSearchUrl = this.getDirectionsUrl + '/request/';
    
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
	
	    getDBLandmarks(data, changeDetectorRef : ChangeDetectorRef) {
    	var that = this;
  	 	return new Promise(function(resolve, reject) {
		     that.http.get<Landmark[]>(that.getDBLandmarksUrl, {
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
	
	getGmapTypes(data) {
	    	var that = this;
	  	 	return new Promise(function(resolve, reject) {
			     that.http.get<LandmarkType[]>(that.getGmapTypesUrl, {
			      headers: new HttpHeaders({'Content-Type': 'application/json'}).set('Authorization', that.cookieService.get("jwt")),
			      observe: 'response'
			     }).subscribe((response : HttpResponse<LandmarkType[]>) => {
			             data = response.body;
			             resolve(data);
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
		
		getLandmarkTypesAsList(data) {
	    	var that = this;
	  	 	return new Promise(function(resolve, reject) {
			     that.http.get<LandmarkType[]>(that.getLandmarkTypesListUrl, {
			      headers: new HttpHeaders({'Content-Type': 'application/json'}).set('Authorization', that.cookieService.get("jwt")),
			      observe: 'response'
			     }).subscribe((response : HttpResponse<LandmarkType[]>) => {
			             data = response.body;
			             resolve(data);
			            } );
	        });
		}
  addLandmarkType(data, isEdit) {
  	 	var that = this;
  	 	return new Promise(function(resolve, reject) {
	  		
	  		if(isEdit){
	  			that.http.put(that.addTypeUrl, data, {
	  			 headers: new HttpHeaders().set('Authorization', that.cookieService.get("jwt")).set('Content-Type', 'application/json')}).subscribe((data: any) =>{
				    if(data){
				      resolve();
				    }
				    else{
				      reject()
				    } });
	  		} else {  		
		    	that.http.post(that.addTypeUrl, data, {
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
	
	deleteLandmarkType(id) {
		var that = this;
  	 	return new Promise(function(resolve, reject) {
		     that.http.delete(that.deleteTypeUrl + id, {
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
	
	deleteSearch(id) {
		var that = this;
	  	 	return new Promise(function(resolve, reject) {
			     that.http.delete(that.deleteSearchUrl + id, {
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
	findRoute(requestDto : RequestDto) {
		var that = this;
		return new Promise(function(resolve, reject) {that.http.post(that.getDirectionsUrl, requestDto, {
		    	headers: new HttpHeaders().set('Authorization', that.cookieService.get("jwt"))})
		    	.subscribe((result: any) =>{
				    if(result){
				      resolve(result);
				    }
				    else{
				      reject()
				    } });
				    });
	}
	
	saveSearch(requestDto : RequestDto) {
		var that = this;
		return new Promise(function(resolve, reject) {that.http.post(that.saveSearchUrl, requestDto, {
		    	headers: new HttpHeaders().set('Authorization', that.cookieService.get("jwt"))})
		    	.subscribe((result: any) =>{
				    if(result){
				      resolve(result);
				    }
				    else{
				      reject()
				    } });
				    });
	}
	
	getSavedSearches(){
    	var that = this;
  	 	return new Promise(function(resolve, reject) {
		     that.http.get<RequestDto[]>(that.getSavedSearchesUrl, {
		      headers: new HttpHeaders({'Content-Type': 'application/json'}).set('Authorization', that.cookieService.get("jwt")),
		      observe: 'response'
		     }).subscribe((response : HttpResponse<RequestDto[]>) => {
		             resolve(response.body);
		             console.log("Asd");
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
  types: LandmarkType[];
  photo: any;
}

export interface LandmarkType {
  id: number,	
  type: string,	
  path: string,
  parentPath: string,
  gmapMapping : string,
  children : any;
  
}

export interface RequestDto {
	id : number;
	name : string;
	origin : string;
	destination : string;
	travelMode : string;
	stopovers : number;
	hotelStays : number;
	email : string;
	maxDeviationFromPath : number;
}
