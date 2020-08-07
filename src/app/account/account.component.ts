import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import {FlatTreeControl} from '@angular/cdk/tree';
import { MatCheckboxModule , MatProgressBarModule} from '@angular/material'
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
    typesLoaded = false;
	userLoaded = false;
	initialSelection : Array<ExampleFlatNode>;

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
			console.log("typesPromise 1");
			that.typesList = data;
			that.dataSource.data = data;
			that.typesLoaded = true;
		});	
		var userPromise = this.userService.getCurrentUserData().then(function(data : User) {
				that.currentUser = data;
				console.log("userPromise");
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
			console.log("constructor 2 ");
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
    ngOnInit() {
    	console.log("ngOnInit");
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