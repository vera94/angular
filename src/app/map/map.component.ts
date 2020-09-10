import { Component, OnInit } from '@angular/core';
import { LandmarkServiceService, Landmark,LandmarkType, RequestDto } from '../landmark-service.service';
import {MatSliderModule} from '@angular/material/slider';
import { MatProgressBarModule} from '@angular/material';
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';
import {SelectionModel} from '@angular/cdk/collections';
import { UserService, User } from '../user.service';
import {FlatTreeControl} from '@angular/cdk/tree';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
declare var google: any;

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
	originInput = "";
	destinationInput = "";
	stopovers =5;
	deviation = 20;
	hotelStays=0;
	includeHotels=false;
	linkInfo;
	checklistSelection : SelectionModel<ExampleFlatNode>;
    typesLoaded = false;
	userLoaded = false;
	initialSelection : Array<ExampleFlatNode>;
	dataLoaded = false;
  	typesList  = [];
  	origin;
  	destination;
  	
	
  constructor( private route: ActivatedRoute, private userService : UserService, private landmarkService : LandmarkServiceService) {
 	 var that = this;
  		  	this.treeFlattener = new MatTreeFlattener(this._transformer, this.getLevel,
      this.isExpandable, this.getChildren);
    this.treeControl = new FlatTreeControl<ExampleFlatNode>(this.getLevel, this.isExpandable);
    this.dataSourcePreferences = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
    this.checklistSelection = new SelectionModel<ExampleFlatNode>(true /* multiple */);
	     var typesPromise = this.landmarkService.getLandmarkTypes(this.typesList);
			typesPromise.then(function(data : any[]) {
				console.log("typesPromise 1");
				that.typesList = data;
				that.dataSourcePreferences.data = data;
				that.typesLoaded = true;
			});	
    		var userPromise = this.userService.getCurrentUserData().then(function(data : User) {
				that.userLoaded = true;
				data.prefferedLandmarkTypes.forEach( (x:LandmarkType) => {
				var nodes =that.treeControl.dataNodes;
				var y;
					for (y in nodes) {
						if (nodes.hasOwnProperty(y) && nodes[y].id == x.id) {
							that.todoItemSelectionToggle(nodes[y]);
							var parent = nodes[y];
							var ancestors = [];
							
							while (parent) {
							  ancestors.push(nodes.indexOf(parent));
						      parent = that.getParentNode(parent);
						    }
						    for (var _i = ancestors.length -1 ; _i >= 0; _i--) {
						    	that.treeControl.expand(nodes[ancestors[_i]]);
							}
							that.treeControl.expand(nodes[y]);
						}
					}
				});
			});
  		
   }
   
       getParentNode(node: ExampleFlatNode): ExampleFlatNode | null {
	    const currentLevel = this.getLevel(node);
	
	    if (currentLevel < 1) {
	      return null;
	    }
	
	    const startIndex = this.treeControl.dataNodes.indexOf(node) - 1;
	
	    for (let i = startIndex; i >= 0; i--) {
	      const currentNode = this.treeControl.dataNodes[i];
	
	      if (this.getLevel(currentNode) < currentLevel) {
	        return currentNode;
	      }
	    }
	    return null;
	  }
	getLevel = (node: ExampleFlatNode) => node.level;

  isExpandable = (node: ExampleFlatNode) => node.expandable;

  getChildren = (node: ExampleFlatNode): ExampleFlatNode[] => node.children;
    
    	
	  private _transformer = (node: LandmarkType, level: number) => {
	  console.log("_transformer ");
	  var newNode = {
	      expandable: !!node.children && node.children.length > 0,
	      type: node.type,
	      level: level,
	      path: node.path,
	      id: node.id,
		  gmapMapping : node.gmapMapping
	    }
      return newNode;
  }

  treeControl = new FlatTreeControl<ExampleFlatNode>(
      node => node.level, node => node.expandable);

  treeFlattener = new MatTreeFlattener(
      this._transformer, node => node.level, node => node.expandable, node => node.children);

  dataSourcePreferences = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
  
  

  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;
  
  descendantsAllSelected(node: ExampleFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected = descendants.every(child =>
      this.checklistSelection.isSelected(child)
    );
    return descAllSelected;
  }
  
   todoItemSelectionToggle(node: ExampleFlatNode): void {
    this.checklistSelection.toggle(node);
    const descendants = this.treeControl.getDescendants(node);
    this.checklistSelection.isSelected(node)
      ? this.checklistSelection.select(...descendants)
      : this.checklistSelection.deselect(...descendants);

    // Force update for the parent
    descendants.every(child =>
      this.checklistSelection.isSelected(child)
    );
    // this.checkAllParentsSelection(node);
  }

  /** Toggle a leaf to-do item selection. Check all the parents to see if they changed */
  todoLeafItemSelectionToggle(node: ExampleFlatNode): void {
    this.checklistSelection.toggle(node);
    // this.checkAllParentsSelection(node);
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
    	console.log("2 data loaded true");
    	that.dataLoaded = true;
    	var autObj = new AutocompleteDirectionsHandler(map, markers, that.linkInfo, that.landmarkService);
    	that.route.params.subscribe(params => {
	  		if( !!params && Object.keys(params).length > 0) {
		    	that.stopovers = params['stopovers'];
				that.deviation = params['deviation'];
				that.hotelStays= params['hotelStays'];
				autObj.originPlaceId = params['origin'];
		  		autObj.destinationPlaceId = params['destination'];
		  		console.log("asd");
		  		autObj.route();
		    }
		  });
		  
    });
  }
  downloadDirections() {
  	if(!!this.linkInfo) {
  		this.linkInfo.click() 
  	}
  }

}

function AutocompleteDirectionsHandler(map, gmarkers, linkInfo, landmarkService) {
  this.gmarkers = gmarkers;
  this.map = map;
  this.landmarkService =landmarkService;
  this.linkInfo = linkInfo;
  this.originPlaceId = null;
  this.destinationPlaceId = null;
  this.travelMode = 'DRIVING';
  this.currentRequest;
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
  this.setupSaveRequestListener();

  this.setupPlaceChangedListener(originAutocomplete, 'ORIG');
  this.setupPlaceChangedListener(destinationAutocomplete, 'DEST');

  this.map.controls.push(originInput);
  this.map.controls.push(
      destinationInput);
  this.map.controls.push(modeSelector);
}


AutocompleteDirectionsHandler.prototype.setupSaveRequestListener = function() {
  var saveButton = document.getElementById('fviconBtn');
  var me = this;

  saveButton.addEventListener('click', function() {
	var promise = me.landmarkService.saveSearch(me.currentRequest);
	promise.then(function() {
		window.confirm("Saved request");
	});
  });
};
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
  var that = this;
  autocomplete.bindTo('bounds', this.map);

  autocomplete.addListener('place_changed', function() {
    var place = autocomplete.getPlace();

    if (!place.place_id) {
      window.alert('Please select an option from the dropdown list.');
      return;
    }
    if (mode === 'ORIG') {
      that.originPlaceId = place.place_id;
    } else {
      that.destinationPlaceId = place.place_id;
    }
    that.route();
  });
};

AutocompleteDirectionsHandler.prototype.route = function() {
  if (!this.originPlaceId || !this.destinationPlaceId) {
    return;
  }
  var that = this;
  var requestDto : RequestDto = {
  id: 0,
  origin : this.originPlaceId,
	destination : this.destinationPlaceId,
	travelMode : this.travelMode,
	stopovers : (<HTMLInputElement>document.getElementById("stopovers")).valueAsNumber,
	hotelStays : (<HTMLInputElement>document.getElementById("hotelStays")).valueAsNumber,
	maxDeviationFromPath : (<HTMLInputElement>document.getElementById("deviation")).valueAsNumber,
	email : "",
	name: ((<HTMLInputElement>document.getElementById("origin-input")).value +" - " + (<HTMLInputElement>document.getElementById("destination-input")).value)
	}
	that.currentRequest = requestDto;
	var promise = that.landmarkService.findRoute(requestDto);
		promise.then(function(data : any) {
		var wpts = [];
	      data.waypoints.forEach((wpt : any)=> {
	      	wpts.push({
	        location: {lat: wpt[0],lng: wpt[1]},
	        stopover: true
	      	});
	      });
         that.directionsService.route(
		  {
			origin: {'placeId': that.originPlaceId},
			destination: {'placeId': that.destinationPlaceId},
			travelMode: that.travelMode,
			waypoints : wpts,
			optimizeWaypoints : true
			
		  },
		  function(response, status) {
			if (status === 'OK') {
			  that.directionsRenderer.setDirections(response);
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
			  if(!(<HTMLInputElement>document.getElementById("origin-input")).value){
			  	(<HTMLInputElement>document.getElementById("origin-input")).value = response.routes[0].legs[0].start_address;
			  	(<HTMLInputElement>document.getElementById("destination-input")).value = response.routes[0].legs[response.routes[0].legs.length - 1].end_address;
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

interface ExampleFlatNode extends LandmarkType{
  expandable: boolean;
  level: number;
}