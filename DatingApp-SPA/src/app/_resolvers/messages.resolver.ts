import { catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import {
  Resolve,
  Router,
} from '@angular/router';
import { of } from 'rxjs';

import { AlertifyService } from './../_service/alertify.service';
import { UserService } from './../_service/user.service';
import { AuthService } from './../_service/auth.service';
import { Message } from './../_models/message';

@Injectable()
export class MessagesResolver implements Resolve<Message[]> {
  pageNumber = 1;
  pageSize = 5;
  messageContainer = 'Unread';

  constructor(
    private userService: UserService,
    private router: Router,
    private alertify: AlertifyService,
    private authService: AuthService
  ) {}

  resolve():
    | Message[]
    | import('rxjs').Observable<Message[]>
    | Promise<Message[]> {
    return this.userService
      .getMessages(
        this.authService.decodedToken.nameid,
        this.pageNumber,
        this.pageSize,
        this.messageContainer
      )
      .pipe(
        catchError(() => {
          this.alertify.error('Error in getting message...');
          this.router.navigate(['/']);
          return of(null);
        })
      );
  }
}
