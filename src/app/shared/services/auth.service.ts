import { Injectable } from "@angular/core";
import { LocalStoreService } from "./local-store.service";
import { Router } from "@angular/router";
import { of } from "rxjs";
import { delay, map } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root"
})

export class AuthService {
  //Only for demo purpose
  authenticated = false;

  constructor(private store: LocalStoreService, private router: Router, private http: HttpClient) {
   // this.checkAuth();
  }

  checkAuth() {
    // this.authenticated = this.store.getItem("demo_login_status");
  }

  // getuser() {
  //   return of({});
  // }

  // signin(credentials) {
  //   /*
  //   this.authenticated = true;
  //   this.store.setItem("demo_login_status", true);
  //   return of({}).pipe(delay(1500));
  //   */
  //  return this.http.post("https://romaripararoma.azurewebsites.net/api/user/authenticate", credentials).pipe(
  //    map(
  //      userData => {
  //       // console.log(userData);
  //       this.store.setItem("email", userData['email']);
  //       let bearer = 'Bearer ' + userData['token'];
  //       this.store.setItem("token", bearer);
  //       console.log(userData);
  //       if (userData['isSuccess'] == true){
  //         this.authenticated = true;
  //       }
  //       else {this.authenticated = false; 
  //         console.log("credenziali errate")}
  //      }
  //    )
  //  )


  // }

  // signout() {
  //   this.authenticated = false;
  //   this.store.clear();
  //   localStorage.removeItem("email");
  //   localStorage.removeItem("token");
    
  //   console.log(this.store.getItem("token"))
  //   this.router.navigateByUrl("/sessions/signin");
  // }
}
