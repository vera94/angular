import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { UserService, User } from '../user.service';
import { LandmarkServiceService, Landmark, LandmarkType } from '../landmark-service.service';


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

    email = new FormControl('', [Validators.required, Validators.email]);
	types = new FormControl();
  	typesList: string[] = [];
    getErrorMessage() {
        return this.email.hasError('required') ? 'You must enter a value' :
            this.email.hasError('email') ? 'Not a valid email' :
                '';
    }

    constructor(private userService : UserService, private landmarkService : LandmarkServiceService) { }

    ngOnInit() {
	    var that = this;
		 var promise = this.landmarkService.getLandmarkTypes(this.typesList);
			promise.then(function(data : any[]) {
				that.typesList = data;
			});
		var userPromise = this.userService.getCurrentUserData().then(function(data : User) {
				that.currentUser = data;
			});;	
    }
    
    updateUser(){
    	var promise = this.userService.updateUser(this.currentUser);
			promise.then(function() {
			});
	}
}
