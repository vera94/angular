import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { UserService } from '../user.service';



@Component({
    selector: 'app-account',
    templateUrl: './account.component.html',
    styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {

    panelOpenState = false;
    hide = true;
    selectedCountry;
    greeting ;

    email = new FormControl('', [Validators.required, Validators.email]);
    countries = ['Bulgaria', 'United Kingdom', 'Italy'];

    getErrorMessage() {
        return this.email.hasError('required') ? 'You must enter a value' :
            this.email.hasError('email') ? 'Not a valid email' :
                '';
    }

    constructor(private userService : UserService) { }

    ngOnInit() {
    }

}
