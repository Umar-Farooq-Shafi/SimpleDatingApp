import { AuthService } from './../_service/auth.service';
import { catchError } from 'rxjs/operators';
import { AlertifyService } from './../_service/alertify.service';
import { UserService } from './../_service/user.service';
import { User } from './../_models/user';
import { Injectable } from '@angular/core';
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { of } from 'rxjs';

@Injectable()
export class MemberEditResolver implements Resolve<User> {
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
    return this.userService.getUser(this.authService.decodedToken.nameid).pipe(
      catchError((err) => {
        this.alertify.error('Error in getting data...');
        this.router.navigate(['/user/members']);
        return of(null);
      })
    );
  }
}
