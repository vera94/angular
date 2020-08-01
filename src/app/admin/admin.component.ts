import { Component, OnInit , Inject, ChangeDetectorRef, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { LandmarkServiceService, Landmark, LandmarkType } from '../landmark-service.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {animate, state, style, transition, trigger} from '@angular/animations';
import { MatTableDataSource } from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import { CookieService } from 'ngx-cookie-service';

declare var $:any;

@Component({ 
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
  animations: [ 
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class AdminComponent implements OnInit {
	isAdminUser = false;
	dataSource = new MatTableDataSource<Landmark>();
  columnsToDisplay = ['id', 'name','type', 'lat', 'lng'];
 stars: number[] = [1, 2, 3, 4, 5];
    selectedValue: number;
  expandedLandmark: Landmark | null;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  
  constructor(public dialog: MatDialog, private landmarkService : LandmarkServiceService, public changeDetectorRef :ChangeDetectorRef,
  	private cookieService: CookieService) {
  		this.isAdminUser = this.cookieService.get("role") == "ADMIN";
  	}
 	

  ngOnInit() {
  	var that= this;
  	this.dataSource.sort = this.sort;
 	 this.landmarkService.getDBLandmarks(this.dataSource, this.changeDetectorRef);
  }
  
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

 openDialog(landmarkData): void {
 	var isEdit;
 	var photo;
 	var text = "";
 	var stars: number[] = [1, 2, 3, 4, 5];
 	var selectedTypes: string[] = [];
 	
 	isEdit = !!landmarkData && !!landmarkData.id;
 	if(!isEdit){
 		landmarkData = {};
 		text = "Add new landmark";
 	} else {
 		text = "Edit landmark";
 		landmarkData.types.forEach((type : any)=> {
	      	selectedTypes.push(type.type);
	      });
 	}
 	 
    const dialogRef = this.dialog.open(AddEntityDialog, {
      width: '250px',
      data: { landmark : $.extend(true, {},landmarkData), photo : {}, dialogText : text , selectedTypes:selectedTypes},
      panelClass: 'rating-list'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (!!result) {
            var that = this;
			var promise = this.landmarkService.addLandmark(result, isEdit);
			promise.then(function() {
			  that.landmarkService.getDBLandmarks(that.dataSource, that.changeDetectorRef);
			});
      } else {
      	
      }
    });
  }
  
  deleteLandmark(id: any) : void {
  		var that = this;
		var promise = this.landmarkService.deleteLandmark(id);
		promise.then(function() {
		  that.landmarkService.getDBLandmarks(that.dataSource, that.changeDetectorRef);
		});
  	
  }
  
  editLandmark(element : Landmark) : void {
  	this.openDialog(element);
  }
  
  addLandmark() : void {
  	this.openDialog({});
  }
}

@Component({
  selector: 'AddEntity',
  templateUrl: './AddEntity.html',
})
export class AddEntityDialog {
	 typesList = [];
	typeControl = new FormControl('', Validators.required);
  constructor(
    public dialogRef: MatDialogRef<AddEntityDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any, private landmarkService : LandmarkServiceService) {
    }
	ngOnInit() {
	var that = this;
	 var promise = this.landmarkService.getLandmarkTypesAsList(this.typesList);
		promise.then(function(data : any[]) {
			that.typesList = data;
		});
	}
	  onNoClick(): void {
	    this.dialogRef.close();
	  }
	  
	  compareFn(option1,option2){
    		return option1.type == option2.type;
  	  }
  	  
	  photoInputChange(fileInputEvent: any) : void {
	  	this.data.photo = fileInputEvent.target.files[0];
	  }
	  
	countStar(star) {
      this.data.landmark.rating = star;
      console.log('Value of star', star);
 	}
}

