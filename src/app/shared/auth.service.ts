import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  apiUrl = "http://localhost:8081/authenticate";
  constructor(private http: HttpClient) { }

  authenticateUser(username: string, password: any) {
    return this.http
      .post<any>(this.apiUrl, { username, password })
      .pipe(
        map(userData => {
          sessionStorage.setItem("username", username);
          let tokenStr = "Bearer " + userData.token;
          sessionStorage.setItem("token", tokenStr);
          return userData;
        })
      );
  }

  isUserLoggedIn() {
    let user = sessionStorage.getItem("username");
    //console.log(!(user === null));
    return !(user === null);
  }

  logOutNow() {
    sessionStorage.removeItem("username");
    sessionStorage.removeItem("token");

  }
}
