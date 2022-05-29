import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthResponseData, AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html'
})
export class AuthComponent {

  isLoginMode = true;
  isLoading = false;
  error : string = null;

  authObservable: Observable<AuthResponseData>;

  @ViewChild('authForm', {static:true}) authForm: NgForm;

  constructor( private authService: AuthService, private router: Router) {

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
      this.authObservable = this.authService.login(email, password)
    }
    else {
      this.authObservable = this.authService.signup(email, password)
    }
    this.authObservable.subscribe(responseData=> {
      console.log(responseData);
      this.router.navigate(['/recipes']);
      this.isLoading=false;
    },
    errorResponse=> {
      this.error = errorResponse;
      this.isLoading = false
    });

    this.authForm.reset;
  }

  alertClose() {
    this.error=null;
  }

}
