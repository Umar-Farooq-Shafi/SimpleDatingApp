import { catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { of } from 'rxjs';

import { AlertifyService } from './../_service/alertify.service';
import { UserService } from './../_service/user.service';
import { User } from './../_models/user';
import { AuthService } from './../_service/auth.service';

@Injectable()
export class MemberListResolver implements Resolve<User> {
  pageNumber = 1;
  pageSize = 5;

  constructor(
    private userService: UserService,
    private router: Router,
    private alertify: AlertifyService,
    private authService: AuthService
  ) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): User | import('rxjs').Observable<User> | Promise<User> {
    return this.userService.getUsers(this.pageNumber, this.pageSize).pipe(
      catchError((err) => {
        this.alertify.error('Error in getting data...');
        this.router.navigate(['/']);
        return of(null);
      })
    );
  }
}
