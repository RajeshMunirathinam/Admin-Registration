import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { HttpModule } from '@angular/http';
import 'rxjs/add/operator/map';
import { tokenNotExpired } from 'angular2-jwt';
import { CookieService } from 'ngx-cookie-service';

@Injectable()
export class AuthService {
  authToken: any;
  user: any;
  isDev
  cookieValue = 'UNKNOWN';
  cookieExists:boolean;

  constructor(private http: Http,private cookieService: CookieService) {
      this.isDev = true;  // Change to false before deployment
      }

  registerUser(user) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post('http://localhost:8080/users/register', user, {headers: headers})
      .map(res => res.json());
  }

  authenticateUser(user) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post('http://localhost:8080/users/authenticate', user, {headers: headers})
      .map(res => res.json());
  }
//omit password  using lodash 
  getProfile() {
    let headers = new Headers();
    this.loadToken();
    headers.append('Authorization', 'JWT ' + this.authToken);
    headers.append('Content-Type', 'application/json');
    return this.http.get('http://localhost:8080/users/profile', {headers: headers})
      .map(res => res.json());
  }

  storeUserData(token, user) {
   // localStorage.setItem('id_token', token);
    localStorage.setItem('user', JSON.stringify(user));
   this.cookieService.set( 'id_token', token, 1  );

    this.authToken = token;
    this.user = user;
  }

  loadToken() {
   // const token = localStorage.getItem('id_token');
    const token = this.cookieValue = this.cookieService.get('id_token');
    this.authToken = token;
  }

  loggedIn() {
    return  this.cookieService.check('id_token');
    //return tokenNotExpired('id_token');


  }

  logout() {
    this.authToken = null;
    this.user = null;
    localStorage.clear();
    this.cookieService.delete('id_token');
  }
}
