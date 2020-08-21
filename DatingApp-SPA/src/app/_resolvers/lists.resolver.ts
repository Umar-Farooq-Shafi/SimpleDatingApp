import { catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Resolve, Router } from '@angular/router';
import { of } from 'rxjs';

import { AlertifyService } from './../_service/alertify.service';
import { UserService } from './../_service/user.service';
import { User } from './../_models/user';

@Injectable()
export class ListsResolver implements Resolve<User> {
  pageNumber = 1;
  pageSize = 5;
  likesParam = 'Likers';

  constructor(
    private userService: UserService,
    private router: Router,
    private alertify: AlertifyService
  ) {}

  resolve(): User | import('rxjs').Observable<User> | Promise<User> {
    return this.userService
      .getUsers(this.pageNumber, this.pageSize, null, this.likesParam)
      .pipe(
        catchError(() => {
          this.alertify.error('Error in getting data...');
          this.router.navigate(['/']);
          return of(null);
        })
      );
  }
}
