import { map } from 'rxjs/operators';
import { Observable, BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

import { User } from '../_models/user';
import { environment } from './../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly url = `${environment.apiUrl}auth`;
  jwtHelper = new JwtHelperService();
  decodedToken: any;
  currentUser: User;
  photoUrl = new BehaviorSubject<string>('../../assets/user.png');
  currentPhotoUrl = this.photoUrl.asObservable();

  constructor(private http: HttpClient) {}

  changeMemberPhoto(photo: string): void {
    this.photoUrl.next(photo);
  }

  login(modal: any): Observable<any> {
    return this.http.post(`${this.url}/login`, modal).pipe(
      map((res: any) => {
        if (res) {
          localStorage.setItem('token', res.token);
          localStorage.setItem('user', JSON.stringify(res.user));
          this.decodedToken = this.jwtHelper.decodeToken(res.token);
          this.currentUser = res.user;
          this.changeMemberPhoto(this.currentUser.photoUrl);
        }
      })
    );
  }

  register(user: User): Observable<any> {
    return this.http.post(`${this.url}/register`, user);
  }

  loggedIn(): boolean {
    return !this.jwtHelper.isTokenExpired(localStorage.getItem('token'));
  }
}
