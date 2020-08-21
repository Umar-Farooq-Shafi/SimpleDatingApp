import { catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { AlertifyService } from './../_service/alertify.service';
import { UserService } from './../_service/user.service';
import { User } from './../_models/user';

@Injectable()
export class MemberDetailResolver implements Resolve<User> {
  constructor(
    private userService: UserService,
    private router: Router,
    private alertify: AlertifyService
  ) {}

  resolve(
    route: ActivatedRouteSnapshot
  ): User | import('rxjs').Observable<User> | Promise<User> {
    return this.userService.getUser(route.params.id).pipe(
      catchError((err) => {
        this.alertify.error(err);
        this.router.navigate(['/user/members']);
        return of(null);
      })
    );
  }
}
