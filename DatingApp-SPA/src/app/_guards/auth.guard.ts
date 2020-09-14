import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';

import { AlertifyService } from './../_service/alertify.service';
import { AuthService } from '../_service/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private service: AuthService,
    private route: Router,
    private alertify: AlertifyService
  ) {}

  canActivate(next: ActivatedRouteSnapshot): boolean {
    const roles = next.data.roles as Array<string>;
    if (roles) {
      const match = this.service.roleMatch(roles);

      if (!match) {
        this.route.navigateByUrl('/user/members');
        this.alertify.error('You are not authorized...');
      }

      return true;
    }

    if (this.service.loggedIn()) {
      return true;
    }
    this.alertify.error('You are not authorized');
    this.route.navigate(['/home']);
    return false;
  }
}
