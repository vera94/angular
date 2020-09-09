import { Component, OnInit } from '@angular/core';
import { LandmarkServiceService, RequestDto } from '../landmark-service.service';
import { MatTableDataSource } from '@angular/material/table';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.css']
})
export class FavoritesComponent implements OnInit {
	displayedColumns = ['name' , 'travelMode', 'stopovers', 'hotelStays', 'maxDeviationFromPath', 'deleteBtn', 'searchBtn'];
	dataSource = new MatTableDataSource<RequestDto>();
  constructor(private _router: Router, private landmarkService : LandmarkServiceService) { }

  ngOnInit() {
  	var that = this;
  	var getUsersDataPromise = this.landmarkService.getSavedSearches().then(function(data : RequestDto[]) {
  		that.dataSource.data = data;
  		});
  }
  
  deleteRequest(data){
  	var that = this;
  	var getUsersDataPromise = this.landmarkService.deleteSearch(data.id).then(function(data : any) {
  		});
  }
  
  search(data){
  	this._router.navigate(['/map', data]);
  }

}