import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly url = 'http://localhost:5000/api/auth';

  constructor(private http: HttpClient) {}

  login(modal: any): Observable<any> {
    return this.http.post(`${this.url}/login`, modal).pipe(
      map((res: any) => {
        if (res) {
          localStorage.setItem('token', res.token);
        }
      })
    );
  }

  register(modal: any): Observable<any> {
    return this.http.post(`${this.url}/register`, modal);
  }
}
