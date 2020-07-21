import { Component, OnInit } from '@angular/core';
import { LandmarkServiceService, Landmark } from '../landmark-service.service';
import {MatSliderModule} from '@angular/material/slider';
import { MatProgressBarModule} from '@angular/material'
declare const google: any;

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
	originInput = "";
	destinationInput = "";
	stopovers =5;
	hotelStaus=0;
	includeHotels=false;
	linkInfo;
	
	dataLoaded = false;
	
  constructor(private landmarkService : LandmarkServiceService) {
  console.log("1 data loaded false");
   }
	
  ngOnInit() {
  	var that = this;
	var landmarks = { data : []};  
	var markers = [];
    let mapProp = {
            center: new google.maps.LatLng(42.7034845,23.3000629),
            zoom: 12,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            mapTypeControl: false
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
			markers.push(marker);
			 google.maps.event.addListener(marker, 'click', function() {
			 	infowindow.setContent(this.IWcontent);
	          	infowindow.open(map, this);
	        });
    	}
    	new AutocompleteDirectionsHandler(map, markers, that.linkInfo);
    	console.log("2 data loaded true");
    	that.dataLoaded = true;
    });
  }
  downloadDirections() {
  	if(!!this.linkInfo) {
  		this.linkInfo.click() 
  	}
  }

}

function AutocompleteDirectionsHandler(map, gmarkers, linkInfo) {
  this.gmarkers = gmarkers;
  this.map = map;
  this.linkInfo = linkInfo;
  this.originPlaceId = null;
  this.destinationPlaceId = null;
  this.travelMode = 'DRIVING';
  this.directionsService = new google.maps.DirectionsService;
  this.directionsRenderer = new google.maps.DirectionsRenderer;
  this.directionsRenderer.setMap(map);
  this.directionsRenderer.setPanel(document.getElementById('right-panel'));

  var originInput = document.getElementById('origin-input');
  var destinationInput = document.getElementById('destination-input');
  var modeSelector = document.getElementById('mode-selector');

  var originAutocomplete = new google.maps.places.Autocomplete(originInput);
  // Specify just the place data fields that you need.
  originAutocomplete.setFields(['place_id']);

  var destinationAutocomplete =
      new google.maps.places.Autocomplete(destinationInput);
  // Specify just the place data fields that you need.
  destinationAutocomplete.setFields(['place_id']);
  this.setupClickListener('changemode-walking', 'WALKING');
  this.setupClickListener('changemode-transit', 'TRANSIT');
  this.setupClickListener('changemode-driving', 'DRIVING');

  this.setupPlaceChangedListener(originAutocomplete, 'ORIG');
  this.setupPlaceChangedListener(destinationAutocomplete, 'DEST');

  this.map.controls.push(originInput);
  this.map.controls.push(
      destinationInput);
  this.map.controls.push(modeSelector);
}

// Sets a listener on a radio button to change the filter type on Places
// Autocomplete.
AutocompleteDirectionsHandler.prototype.setupClickListener = function(
    id, mode) {
  var radioButton = document.getElementById(id);
  var me = this;

  radioButton.addEventListener('click', function() {
    me.travelMode = mode;
    me.route();
  });
};

AutocompleteDirectionsHandler.prototype.setupPlaceChangedListener = function(
    autocomplete, mode) {
  var me = this;
  autocomplete.bindTo('bounds', this.map);

  autocomplete.addListener('place_changed', function() {
    var place = autocomplete.getPlace();

    if (!place.place_id) {
      window.alert('Please select an option from the dropdown list.');
      return;
    }
    if (mode === 'ORIG') {
      me.originPlaceId = place.place_id;
    } else {
      me.destinationPlaceId = place.place_id;
    }
    me.route();
  });
};

AutocompleteDirectionsHandler.prototype.route = function() {
  if (!this.originPlaceId || !this.destinationPlaceId) {
    return;
  }
  var me = this;
  var routeBoxer = google.maps.RouteBoxer;
  var distance = 20; // km
  var waypointsSet = new Set();

  this.directionsService.route(
      {
        origin: {'placeId': this.originPlaceId},
        destination: {'placeId': this.destinationPlaceId},
        travelMode: this.travelMode
      },
      function(response, status) {
        if (status === 'OK') {
          var path = response.routes[0].overview_path;
     	  var waypointsSet = drawBoxes(path, me.map , me.gmarkers);
     	  var wpts = [];
	      waypointsSet.forEach((wpt : any)=> {
	      	wpts.push({
	        location: wpt.getPosition(),
	        stopover: true
	      	});
	      });
        } else {
          window.alert('Directions request failed due to ' + status);
        }
        
        me.directionsService.route(
      {
        origin: {'placeId': me.originPlaceId},
        destination: {'placeId': me.destinationPlaceId},
        travelMode: me.travelMode,
        waypoints : wpts,
        optimizeWaypoints : true
        
      },
      function(response, status) {
        if (status === 'OK') {
          me.directionsRenderer.setDirections(response);
          var content = ""
          if(!!response){
          	response.routes[0].legs.forEach( leg => {
          		if(!!content) {
          			content = content + "\n\n";
          		}
          	    content = content + leg.end_address+ "\n";
          	    content = content + leg.distance.text + "\t" + leg.duration.text + "\n\n";
	          	leg.steps.forEach( step => {
	          		content = content + step.instructions + "\t" + step.distance.text + "\t" + step.duration.text + "\n";
	         	});
         	});
         	content = content.replace(/<[^>]*>/g,'');
          }
          const blob = new Blob([content], {type: 'text/csv'});
		  var downloadURL = window.URL.createObjectURL(blob);
		  var link = <HTMLAnchorElement>document.getElementById('dwnldBtn');
		  link.href = downloadURL;
		  var legs =response.routes[0].legs;
		  link.download = "Directions "+ legs[0].start_address + " " +legs[legs.length -1].end_address+  ".txt";
        } else {
          window.alert('Directions request failed due to ' + status);
        }
      });
        
        
        
      });
      
   
};

function drawBoxes(path, map, markers) {
  var waypoints = new Set();
  var circles = new Array(path.length);
  for (var i = 0; i < path.length; i++) {
    circles[i] = new google.maps.Circle({
      strokeColor: '#FF0000',
        strokeOpacity: 0.01,
        strokeWeight: 2,
        fillColor: '#FF0000',
        fillOpacity: 0.01,
        center: path[i],
        radius: 100000
    });
     
  }
   for (var j=0; j< markers.length; j++) {
	   var include =false;
	   for (var h=0; h< circles.length; h++) {
          if (circles[h].contains(markers[j].getPosition())) {
             include = true; 
             break;
         }
       }
	   if(include)
			waypoints.add(markers[j]);
	}
	return waypoints;
}

google.maps.Circle.prototype.contains = function(latLng) {
  return this.getBounds().contains(latLng) && google.maps.geometry.spherical.computeDistanceBetween(this.getCenter(), latLng) <= this.getRadius();
}
