import { Component, OnInit } from '@angular/core';
import { LandmarkServiceService, Landmark } from '../landmark-service.service';
declare const google: any;

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  constructor(private landmarkService : LandmarkServiceService) { }

  ngOnInit() {
  	var that = this;
	var landmarks = { data : []};  
    let mapProp = {
            center: new google.maps.LatLng(42.7034845,23.3000629),
            zoom: 7,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
    let map = new google.maps.Map(document.getElementById("googleMap"), mapProp);
    var infowindow = new google.maps.InfoWindow({maxWidth: 300});
    this.landmarkService.getAllLandmarks(landmarks, null).then(function() {
    	for (var i in landmarks.data) {
    		var landmark = landmarks.data[i];
    		var contentString = '<div id="content">'+
            '<div id="siteNotice">'+
            '</div>'+
            '<h1 id="firstHeading" class="firstHeading">' + landmark.name + '</h1>'+
            '<div id="bodyContent">'+
            '<p>' + landmark.description + '</p>'+
            '</div >'+
	            '<div class="example-element-diagram">' +
	          	'<img  class="photo" src="data:image/jpg;base64,' +  landmark.photo + '">' + 
	        	'</div>'+
            '</div>';
            
	    	var marker = new google.maps.Marker({
			    position: {lat: landmark.lat, lng: landmark.lng},
			    title: landmark.name,
			    IWcontent : contentString
			});
			marker.setMap(map);
			
			 google.maps.event.addListener(marker, 'click', function() {
			 	infowindow.setContent(this.IWcontent);
	          	infowindow.open(map, this);
	        });
    	}
    });
  }

}
