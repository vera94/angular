import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import {FlatTreeControl} from '@angular/cdk/tree';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';
import {animate, state, style, transition, trigger} from '@angular/animations';
import { LandmarkServiceService, Landmark, LandmarkType } from '../landmark-service.service';

export interface Tile {
  color: string;
  cols: number;
  rows: number;
  text: string;
}

/** Flat node with expandable and level information */
interface ExampleFlatNode extends LandmarkType{
  expandable: boolean;
  level: number;
}
@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
	typesList = [];
	gmapTypes = [];
    tiles: Tile[] = [
        { text: 'Hotels', cols: 3, rows: 1, color: 'lightblue' },
        { text: 'Sights', cols: 1, rows: 2, color: 'lightgreen' },
        { text: 'Restaurants', cols: 1, rows: 1, color: 'lightpink' },
        { text: 'Fun facts and legends', cols: 2, rows: 1, color: '#DDBDF1' },
    ];

    ngOnInit() {
     var that = this;
	 var promise = this.landmarkService.getLandmarkTypes(this.typesList);
		promise.then(function(data : any[]) {
			that.typesList = data;
			that.dataSource.data = data;
			
		});
	var promise = this.landmarkService.getGmapTypes(this.gmapTypes);
		promise.then(function(data : any[]) {
			that.gmapTypes = data;
		});
    }
    
    addNewItem(node: ExampleFlatNode) {
	    this.treeControl.expand(node);
	    var type : LandmarkType = {"parentPath" : node.path} as LandmarkType;
	    this.openDialog(type, false);
  	}
  	
  	editItem(node: ExampleFlatNode) {
	    var type : LandmarkType = node;
	    this.openDialog(type, true);
  	}
  	
  	deleteItem(id) {
	    this.landmarkService.deleteLandmarkType(id);
  	}
    openDialog(landmarkType, isEdit): void {
 	var text = "";
 	if(!isEdit){
 		text = "Add new landmark type";
 	} else {
 		text = "Edit landmark type";
 	}
 	 
    const dialogRef = this.dialog.open(AddTypeDialog, {
      width: '250px',
      data: {landmarkType : landmarkType, dialogText : text, gmapTypes : this.gmapTypes }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!!result && !!result.landmarkType) {
            var that = this;
			var promise = this.landmarkService.addLandmarkType(result.landmarkType, isEdit);
			promise.then(function() {
			});
      } else {
      	
      }
    });
  }
    addLandmarkType() : void {
  	this.openDialog({}, false);
  }
  private _transformer = (node: LandmarkType, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      type: node.type,
      level: level,
      path: node.path,
      id: node.id,
	  gmapMapping : node.gmapMapping
    };
  }

  treeControl = new FlatTreeControl<ExampleFlatNode>(
      node => node.level, node => node.expandable);

  treeFlattener = new MatTreeFlattener(
      this._transformer, node => node.level, node => node.expandable, node => node.children);

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  constructor(public dialog: MatDialog, private landmarkService : LandmarkServiceService) {
  }

  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;

}

@Component({
  selector: 'AddType',
  templateUrl: './AddEntity.html',
})
export class AddTypeDialog {
	 typesList = [];
	typeControl = new FormControl('', Validators.required);
  constructor(
    public dialogRef: MatDialogRef<AddTypeDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
	 private landmarkService : LandmarkServiceService) {
    }
	ngOnInit() {
	}
	  onNoClick(): void {
	    this.dialogRef.close();
	  }
	  
}
