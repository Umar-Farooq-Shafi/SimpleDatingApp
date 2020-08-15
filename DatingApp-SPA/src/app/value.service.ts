import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ValueService {
  constructor(private http: HttpClient) {}

  getValues(): Observable<any> {
    return this.http.get('http://localhost:5000/api/values');
  }
}
