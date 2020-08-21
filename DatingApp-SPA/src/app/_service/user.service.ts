import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { environment } from './../../environments/environment';
import { User } from '../_models/user';
import { Message } from '../_models/message';
import { PaginatedResult } from '../_models/pagination';
import { map } from 'rxjs/operators';

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

  getUsers(
    page?,
    itemsPerPage?,
    userParams?,
    likesParam?
  ): Observable<PaginatedResult<User[]>> {
    const paginatedResult = new PaginatedResult<User[]>();

    let params = new HttpParams();

    if (page != null && itemsPerPage != null) {
      params = params.append('pageNumber', page);
      params = params.append('pageSize', itemsPerPage);
    }
    if (userParams != null) {
      params = params.append('minAge', userParams.minAge);
      params = params.append('maxAge', userParams.maxAge);
      params = params.append('gender', userParams.gender);
      params = params.append('orderBy', userParams.orderBy);
    }

    if (likesParam === 'Likers') {
      params = params.append('likers', 'true');
    }

    if (likesParam === 'Likees') {
      params = params.append('likees', 'true');
    }

    return this.http
      .get<User[]>(`${this.url}users`, {
        headers: new HttpHeaders({
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        }),
        observe: 'response',
        params,
      })
      .pipe(
        map((res: any) => {
          paginatedResult.result = res.body;
          if (res.headers.get('Pagination') != null) {
            paginatedResult.pagination = JSON.parse(
              res.headers.get('Pagination')
            );
          }
          return paginatedResult;
        })
      );
  }

  getUser(id: number): Observable<User> {
    return this.http.get<User>(`${this.url}users/${id}`, httpOptions);
  }

  updateUser(id: number, user: User): Observable<any> {
    return this.http.put(`${this.url}users/${id}`, user, httpOptions);
  }

  setMainPhoto(userId: number, id: number): Observable<any> {
    return this.http.post(
      `${this.url}users/${userId}/photos/${id}/setMain`,
      {},
      httpOptions
    );
  }

  deletePhoto(userId: number, id: number): Observable<any> {
    return this.http.delete(
      `${this.url}users/${userId}/photos/${id}`,
      httpOptions
    );
  }

  sendLike(id: number, recipientId: number): Observable<any> {
    return this.http.post(
      `${this.url}users/${id}/like/${recipientId}`,
      {},
      httpOptions
    );
  }

  getMessages(
    id: number,
    page?,
    itemsPerPage?,
    messageContainer?
  ): Observable<PaginatedResult<Message[]>> {
    const paginatedResult = new PaginatedResult<Message[]>();

    let params = new HttpParams();
    params = params.append('MessageContainer', messageContainer);

    if (page != null && itemsPerPage != null) {
      params = params.append('pageNumber', page);
      params = params.append('pageSize', itemsPerPage);
    }

    return this.http
      .get<Message[]>(`${this.url}users/${id}/messages`, {
        headers: new HttpHeaders({
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        }),
        observe: 'response',
        params,
      })
      .pipe(
        map((res: any) => {
          paginatedResult.result = res.body;
          if (res.headers.get('Pagination') != null) {
            paginatedResult.pagination = JSON.parse(
              res.headers.get('Pagination')
            );
          }
          return paginatedResult;
        })
      );
  }

  getMessageThread(id: number, recipientId: number): Observable<Message[]> {
    return this.http.get<Message[]>(
      `${this.url}users/${id}/messages/thread/${recipientId}`,
      httpOptions
    );
  }

  sendMessage(id: number, message: Message): Observable<any> {
    return this.http.post(
      `${this.url}users/${id}/messages/`,
      message,
      httpOptions
    );
  }

  deleteMessage(id: number, userId: number): Observable<any> {
    return this.http.post(
      `${this.url}users/${userId}/messages/${id}`,
      {},
      httpOptions
    );
  }

  markAsRead(userId: number, messageId: number): void {
    this.http
      .post(
        `${this.url}users/${userId}/messages/${messageId}/read`,
        {},
        httpOptions
      )
      .subscribe(() => {});
  }
}
