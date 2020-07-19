import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import {FlatTreeControl} from '@angular/cdk/tree';
import { MatCheckboxModule } from '@angular/material'
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { UserService, User } from '../user.service';
import { LandmarkServiceService, Landmark, LandmarkType } from '../landmark-service.service';
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';
import {SelectionModel} from '@angular/cdk/collections';


@Component({
    selector: 'app-account',
    templateUrl: './account.component.html',
    styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {
	typeControl = new FormControl('', Validators.required);
    panelOpenState = false;
    hide = true;
    selectedCountry;
    greeting ;
    currentUser : User;
    checklistSelection : SelectionModel<ExampleFlatNode>;

    email = new FormControl('', [Validators.required, Validators.email]);
	types = new FormControl();
  	typesList  = [];
    getErrorMessage() {
        return this.email.hasError('required') ? 'You must enter a value' :
            this.email.hasError('email') ? 'Not a valid email' :
                '';
    }

    constructor(private userService : UserService, private landmarkService : LandmarkServiceService,
     public dialog: MatDialog) { 
     var that =this;
     	this.treeFlattener = new MatTreeFlattener(this._transformer, this.getLevel,
      this.isExpandable, this.getChildren);
    this.treeControl = new FlatTreeControl<ExampleFlatNode>(this.getLevel, this.isExpandable);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
    this.checklistSelection = new SelectionModel<ExampleFlatNode>(true /* multiple */);
    var typesPromise = this.landmarkService.getLandmarkTypes(this.typesList);
		typesPromise.then(function(data : any[]) {
			that.typesList = data;
			that.dataSource.data = data;
			
		});	
		var userPromise = this.userService.getCurrentUserData().then(function(data : User) {
				that.currentUser = data;
			});
     }
getLevel = (node: ExampleFlatNode) => node.level;

  isExpandable = (node: ExampleFlatNode) => node.expandable;

  getChildren = (node: ExampleFlatNode): ExampleFlatNode[] => node.children;
    ngOnInit() {
    }
    
    updateUser(){
    	var promise = this.userService.updateUser(this.currentUser);
			promise.then(function() {
			});
	}
	
	updatePrefferdTypes(){
		var checked = this.checklistSelection.selected;
		var promise = this.userService.updateUserPrefferences(checked);
			promise.then(function() {
			});
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
}

interface ExampleFlatNode extends LandmarkType{
  expandable: boolean;
  level: number;
}