import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { AuthService } from "./auth.service";

@Injectable({providedIn:'root'})
export class AuthGuard implements CanActivate {

    constructor (private router: Router, private authService: AuthService) {

    }
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
        
        return this.authService.user.pipe(map(user=> {
            const auth = !!user;
            if(auth) {
                return true;
            }
            else {
                return this.router.createUrlTree(['/auth']);
            }
        }));
    }
    
}