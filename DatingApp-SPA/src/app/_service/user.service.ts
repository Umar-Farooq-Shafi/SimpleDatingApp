import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { User } from '../_models/user';

const httpOptions = {
  headers: new HttpHeaders({
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  }),
};

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly url = `${environment.apiUrl}`;

  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.url}users`, httpOptions);
  }

  getUser(id: number): Observable<User> {
    return this.http.get<User>(`${this.url}users/${id}`, httpOptions);
  }

  updateUser(id: number, user: User): Observable<any> {
    return this.http.put(`${this.url}users/${id}`, user, httpOptions);
  }
}
