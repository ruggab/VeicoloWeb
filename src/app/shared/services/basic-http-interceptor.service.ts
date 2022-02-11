import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthenticationService } from 'src/app/authentication.service';

@Injectable({
  providedIn: 'root'
})

export class BasicHttpInterceptorService implements HttpInterceptor {

  constructor(private authenticationService: AuthenticationService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      // add authorization header with jwt token if available
      let currentUser = this.authenticationService.currentUserValue;
      if (currentUser) {
          request = request.clone({
              setHeaders: {
                  Authorization: `Bearer ${currentUser.accessToken}`
              }
          });
      }

      return next.handle(request);
  }

}
