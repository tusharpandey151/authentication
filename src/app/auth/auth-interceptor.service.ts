import { HttpEvent, HttpHandler, HttpInterceptor, HttpParams, HttpRequest } from "@angular/common/http";
import { Observable } from "rxjs";
import { exhaustMap, take } from "rxjs/operators";
import { AuthService } from "./auth.service";

export class AuthInterceptor implements HttpInterceptor{
    
    constructor(private authService: AuthService) {

    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return this.authService.user.pipe(take(1), exhaustMap(user=> {
            if(!user) {
                return next.handle(req);
            }
            req = req.clone({
                params: new HttpParams().set('auth', user.token)
            })
            return next.handle(req);
        }))
    }

}