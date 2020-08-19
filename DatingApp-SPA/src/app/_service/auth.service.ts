import { environment } from './../../environments/environment';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly url = `${environment.apiUrl}auth`;
  jwtHelper = new JwtHelperService();
  decodedToken: any;

  constructor(private http: HttpClient) {}

  login(modal: any): Observable<any> {
    return this.http.post(`${this.url}/login`, modal).pipe(
      map((res: any) => {
        if (res) {
          localStorage.setItem('token', res.token);
          this.decodedToken = this.jwtHelper.decodeToken(res.token);
        }
      })
    );
  }

  register(modal: any): Observable<any> {
    return this.http.post(`${this.url}/register`, modal);
  }

  loggedIn(): boolean {
    return !this.jwtHelper.isTokenExpired(localStorage.getItem('token'));
  }
}
