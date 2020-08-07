import { Component, OnInit } from '@angular/core';
import { LandmarkServiceService, RequestDto } from '../landmark-service.service';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.css']
})
export class FavoritesComponent implements OnInit {
	displayedColumns = ['name' , 'travelMode', 'stopovers', 'hotelStays', 'maxDeviationFromPath', 'deleteBtn', 'searchBtn'];
	dataSource = new MatTableDataSource<RequestDto>();
  constructor(private landmarkService : LandmarkServiceService) { }

  ngOnInit() {
  	var that = this;
  	var getUsersDataPromise = this.landmarkService.getSavedSearches().then(function(data : RequestDto[]) {
  		that.dataSource.data = data;
  		});
  }

}
