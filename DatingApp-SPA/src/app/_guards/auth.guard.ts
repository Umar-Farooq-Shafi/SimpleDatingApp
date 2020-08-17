import { AlertifyService } from './../_service/alertify.service';
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
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

  canActivate(): boolean {
    if (this.service.loggedIn()) {
      return true;
    }
    this.alertify.error('You are not authorized');
    this.route.navigate(['/home']);
    return false;
  }
}
