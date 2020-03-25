import { Component, OnInit , Inject, ChangeDetectorRef, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { LandmarkServiceService, Landmark, LandmarkType } from '../landmark-service.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {animate, state, style, transition, trigger} from '@angular/animations';
import { MatTableDataSource } from '@angular/material/table';
import {MatSort} from '@angular/material/sort';

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
	dataSource = new MatTableDataSource<Landmark>();
  columnsToDisplay = ['id', 'name','type', 'lat', 'lng'];
  expandedLandmark: Landmark | null;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  
  constructor(public dialog: MatDialog, private landmarkService : LandmarkServiceService, public changeDetectorRef :ChangeDetectorRef ) {}
 	

  ngOnInit() {
  	var that= this;
  	this.dataSource.sort = this.sort;
 	 this.landmarkService.getAllLandmarks(this.dataSource, this.changeDetectorRef);
  }
  
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  
 openDialog(landmarkData): void {
 	var isEdit;
 	var photo;
 	var text = "";
 	isEdit = !!landmarkData && !!landmarkData.id;
 	if(!isEdit){
 		landmarkData = {};
 		text = "Add new landmark";
 	} else {
 		text = "Edit landmark";
 	}
 	 
    const dialogRef = this.dialog.open(AddEntityDialog, {
      width: '250px',
      data: { landmark : landmarkData, photo : {}, dialogText : text }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (!!result) {
            var that = this;
			var promise = this.landmarkService.addLandmark(result, isEdit);
			promise.then(function() {
			  that.landmarkService.getAllLandmarks(that.dataSource, that.changeDetectorRef);
			});
      }
    });
  }
  
  deleteLandmark(id: any) : void {
  		var that = this;
		var promise = this.landmarkService.deleteLandmark(id);
		promise.then(function() {
		  that.landmarkService.getAllLandmarks(that.dataSource, that.changeDetectorRef);
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
    @Inject(MAT_DIALOG_DATA) public data: Landmark, private landmarkService : LandmarkServiceService,) {}
	ngOnInit() {
	var that = this;
	 var promise = this.landmarkService.getLandmarkTypes(this.typesList);
		promise.then(function(data : any[]) {
			that.typesList = data;
			alert("adsf");
		});
	}
	  onNoClick(): void {
	    this.dialogRef.close();
	  }
	  
	  photoInputChange(fileInputEvent: any) : void {
	  	this.data.photo = fileInputEvent.target.files[0];
	  }
}

