import { Component, OnInit , Inject, ChangeDetectorRef } from '@angular/core';
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
  ]
})
export class AdminComponent implements OnInit {
	dataSource = new MatTableDataSource<Landmark>();;
  columnsToDisplay = ['id', 'name', 'lat', 'lng', 'Photo Url'];
  expandedLandmark: Landmark | null;
  photo;
  constructor(public dialog: MatDialog, private landmarkService : LandmarkServiceService, public changeDetectorRef :ChangeDetectorRef ) {}

  ngOnInit() {
 	 this.landmarkService.getAllLandmarks(this.dataSource, this.changeDetectorRef);
  }
  
 openDialog(): void {
    const dialogRef = this.dialog.open(AddEntityDialog, {
      width: '250px',
      data: { landmark : {}, photo : {}}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.landmarkService.addLandmark(result);
    });
  }
  
  deleteLandmark(id: any) : void {
  	this.landmarkService.deleteLandmark(id);
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

