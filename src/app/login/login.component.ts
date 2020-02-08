import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormBuilder, FormGroup} from '@angular/forms';
import { UserService } from '../user.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
	registerForm : FormGroup;
    panelOpenState = false;
    hide = true;
    selectedCountry;
    mismatch = false;
    email;
    password;
    confirmPassword;
    

    constructor(private formBuilder: FormBuilder) { }
    
    ngOnInit() {
	    this.registerForm = this.formBuilder.group({
	            email: ['', [Validators.required, Validators.email]],
	            password: ['', [Validators.required, Validators.minLength(8)]],
	            confirmPassword: ['', [Validators.required]]
	        },{ validators: this.passwordMatchValidator });
    }
   
    
	passwordMatchValidator(fr :FormControl) {
		return fr.get("password").value === fr.get("confirmPassword").value ? null : {'mismatch' : true};
	} 
	
    getErrorMessage() {
        return this.registerForm.controls.email.hasError('required') ? 'You must enter a value' :
            this.registerForm.controls.email.hasError('email') ? 'Not a valid email' :
                '';
    }

    getErrorPwdMessage() {
        return this.registerForm.controls.password.hasError('required') ? 'You must enter a value' :
            this.registerForm.controls.password.hasError('minlength') ? 'You must enter at least 8 symbols' :
                '';
    }

    getErrorConfirmPwdMessage() {
        return this.registerForm.controls.confirmPassword.hasError('required') ? 'You must enter a value' :
            this.registerForm.hasError('mismatch') ? 'Passwords mismatch' :
                '';
    }

	submit() {
	  let data = {
	  	email : this.email.value,
	  	password : this.password.value
	  	
	  };
	}
	
}
