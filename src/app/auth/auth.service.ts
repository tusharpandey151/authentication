import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, tap } from "rxjs/operators";
import {BehaviorSubject, Subject, throwError} from "rxjs"
import { User } from "./user.model";
import { Router } from "@angular/router";

export interface AuthResponseData {
    idToken: string,
    email: string,
    refreshToken: string,
    expiresIn: string
    localId: string,
    registered?:	boolean;
}

@Injectable({ providedIn: 'root' })
export class AuthService {

    user = new BehaviorSubject<User>(null);

    authenticationTimer;
    
    constructor(private http: HttpClient, private router: Router) {

    }

    signup(email: string, password: string) {
        return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBGyF00Tkb_7tJjvnsU0SgyMHMo7sIatHM',
            {
                email: email,
                password: password,
                returnSecureToken: true
            }).pipe(catchError (this.handleError),
            tap(respData => {
                this.handleAuthentication(respData.email, respData.localId, respData.idToken, +respData.expiresIn);
            }));
    }

    
    login(email: string, password: string) {
        return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBGyF00Tkb_7tJjvnsU0SgyMHMo7sIatHM', 
        {
            email: email,
            password: password,
            returnSecureToken: true
        }).pipe(catchError(this.handleError),
        tap(respData => {
            this.handleAuthentication(respData.email, respData.localId, respData.idToken, +respData.expiresIn);
        }));
    }

    logout() {
        this.user.next(null);
        localStorage.removeItem('user');
        if(this.authenticationTimer) {
            clearTimeout(this.authenticationTimer);
        }
        this.router.navigate(['/auth']);
    }

    handleError( errorResponse: HttpErrorResponse) {
    let errorMsg = "An Unknown Error Occured";
    if(!errorResponse.error || !errorResponse.error.error) {
        return throwError(errorMsg);
    }
    switch (errorResponse.error.error.message) {
        case 'EMAIL_EXISTS':
            errorMsg = "The Email already Exists";
            break;
        case 'EMAIL_NOT_FOUND':
            errorMsg = "This Email is not Registered"
            break;
        case 'INVALID_PASSWORD': 
            errorMsg = "This Email/Password combination is incorrect"
            break;
      }
      return throwError(errorMsg);
}

handleAuthentication(email: string, userId: string, token: string, expiresIn: number) {
    const expirationDate : Date = new Date(new Date().getTime()+  expiresIn * 1000);
    const user = new User(email, userId, token, expirationDate);
    localStorage.setItem('user', JSON.stringify(user));
    this.authenticationTimer = setTimeout(()=> {
        localStorage.removeItem('user');
        this.user.next(null);
    }, expiresIn*1000);
    this.user.next(user);
}
}
