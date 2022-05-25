import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html'
})
export class AuthComponent {

  isLoginMode = true;
  isLoading = false;
  error : string = null;

  @ViewChild('authForm', {static:true}) authForm: NgForm;

  constructor( private authService: AuthService) {

  }
  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;

  }

  onSubmit() {
    console.log(this.authForm);

    const email = this.authForm.value.email;
    const password = this.authForm.value.password;

    this.isLoading = true;
    if(this.isLoginMode) {

    }
    else {
      this.authService.signup(email, password).subscribe(responseData=> {
        console.log(responseData);
        this.isLoading=false;
      },
      error=> {
        this.error = "An Error Occurred";
        this.isLoading = false
      })
    }

    this.authForm.reset;
  }

}
