import { Component, OnInit , Inject, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { LandmarkServiceService, Landmark } from '../landmark-service.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {animate, state, style, transition, trigger} from '@angular/animations';
import { MatTableDataSource } from '@angular/material/table';
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
  columnsToDisplay = ['id', 'name', 'lat', 'lng'];
  expandedLandmark: Landmark | null;
  constructor(public dialog: MatDialog, private landmarkService : LandmarkServiceService, public changeDetectorRef :ChangeDetectorRef ) {}

  ngOnInit() {
 	 this.landmarkService.getAllLandmarks(this.dataSource, this.changeDetectorRef);
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
	      this.landmarkService.addLandmark(result, isEdit);
	      this.landmarkService.getAllLandmarks(this.dataSource, this.changeDetectorRef);
      }
    });
  }
  
  deleteLandmark(id: any) : void {
  	this.landmarkService.deleteLandmark(id);
  	this.landmarkService.getAllLandmarks(this.dataSource, this.changeDetectorRef);
  }
  
  editLandmark(element : Landmark) : void {
  	this.openDialog(element);
  	this.landmarkService.getAllLandmarks(this.dataSource, this.changeDetectorRef);
  }
  
  addLandmark() : void {
  	this.openDialog({});
  	this.landmarkService.getAllLandmarks(this.dataSource, this.changeDetectorRef);
  }
}

@Component({
  selector: 'AddEntity',
  templateUrl: './AddEntity.html',
})
export class AddEntityDialog {

  constructor(
    public dialogRef: MatDialogRef<AddEntityDialog>,
    @Inject(MAT_DIALOG_DATA) public data: Landmark) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
  
  photoInputChange(fileInputEvent: any) : void {
  	this.data.photo = fileInputEvent.target.files[0];
  }
}

