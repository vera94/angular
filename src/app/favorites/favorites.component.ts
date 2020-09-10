import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { LandmarkServiceService, RequestDto } from '../landmark-service.service';
import { MatTableDataSource } from '@angular/material/table';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FavoritesComponent implements OnInit {
	displayedColumns = ['name' , 'travelMode', 'stopovers', 'hotelStays', 'maxDeviationFromPath', 'deleteBtn', 'searchBtn'];
	dataSource = new MatTableDataSource<RequestDto>();
  constructor(private _router: Router, private landmarkService : LandmarkServiceService, public changeDetectorRef :ChangeDetectorRef) { }

  ngOnInit() {
  	var that = this;
  	this.landmarkService.getSavedSearches(that.dataSource, that.changeDetectorRef).then(function(data : RequestDto[]) {
  			that.dataSource.data = data;
  		});
  }
  
  deleteRequest(data){
  	var that = this;
  	var getUsersDataPromise = this.landmarkService.deleteSearch(data.id).then(function(data : any) {
  		});
	getUsersDataPromise.then(function() {
	  that.landmarkService.getSavedSearches(that.dataSource, that.changeDetectorRef);
	});
  }
  
  search(data){
  	this._router.navigate(['/map', data]);
  }

}
