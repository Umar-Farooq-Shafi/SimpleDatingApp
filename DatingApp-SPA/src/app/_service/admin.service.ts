import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

import { User } from './../_models/user';
import { environment } from './../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getUsersWithRoles(): Observable<any> {
    return this.http.get(`${this.baseUrl}admin/usersWithRoles`);
  }

  updateUserRoles(user: User, roles: object): Observable<any> {
    return this.http.post(`${this.baseUrl}admin/editRoles/${user.userName}`, roles);
  }

  getPhotosForApproval(): Observable<any> {
    return this.http.get(`${this.baseUrl}admin/photosForModeration`);
  }

  approvePhoto(photoId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}admin/approvePhoto/${photoId}`, {});
  }

  rejectPhoto(photoId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}admin/rejectPhoto/${photoId}`, {});
  }
}
