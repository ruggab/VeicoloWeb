import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  login(username: string, password: string) {
    return this.http.post<any>(`${environment.apiUrl}auth/signin`, { username, password })
      .pipe(map(response => {
        if (response) {
          console.log(response);
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          
          localStorage.setItem('currentUser', JSON.stringify(response));
          
          this.currentUserSubject.next(response);
          return response;
        } else {
          console.log(response);
          // login failed
          console.log("credenziali errate")
          return response;
        }

      }));
  }

  register(email: string, password: string, mobile: string, firstName: string, lastName: string) {
    return this.http.post<any>(`${environment.apiUrl}auth/signup`, { email, password, mobile, firstName, lastName })
      .pipe(map(response => { 
          return response;
      }));
  }

  confirmEmail(key: string){
    return this.http.post<any>(`${environment.apiUrl}/user/confirmEmail`, { key })
    .pipe(map(response => {
      return response;
    }));
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

}

export class User {

  id: number;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  accessToken: string;
  roles: string[];

}