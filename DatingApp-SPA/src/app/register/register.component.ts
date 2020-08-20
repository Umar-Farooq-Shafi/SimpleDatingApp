import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  OnDestroy,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';

import { AlertifyService } from './../_service/alertify.service';
import { AuthService } from './../_service/auth.service';
import { User } from '../_models/user';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit, OnDestroy {
  @Output() cancelReg = new EventEmitter();
  private subs$: Subscription;
  private isSub = false;
  private loginSubs$: Subscription;
  private isLoginSub = false;
  bsConfig: Partial<BsDatepickerConfig>;
  user: User;

  registerForm: FormGroup;

  constructor(
    private service: AuthService,
    private alertify: AlertifyService,
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnDestroy(): void {
    if (this.isSub) {
      this.subs$.unsubscribe();
    }
    if (this.isLoginSub) {
      this.loginSubs$.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.bsConfig = {
      containerClass: 'theme-red',
      isAnimated: true,
    };

    this.registerForm = this.fb.group(
      {
        gender: ['male'],
        username: [
          '',
          [
            Validators.required,
            Validators.minLength(4),
            Validators.maxLength(8),
          ],
        ],
        knownAs: ['', Validators.required],
        dateOfBirth: [null, Validators.required],
        city: ['', Validators.required],
        country: ['', Validators.required],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(4),
            Validators.maxLength(8),
          ],
        ],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  passwordMatchValidator(g: FormGroup): any {
    return g.get('password').value === g.get('confirmPassword').value
      ? null
      : { mismatch: true };
  }

  register(): void {
    if (this.registerForm.valid) {
      this.user = Object.assign({}, this.registerForm.value);
      this.subs$ = this.service
        .register(this.user)
        .pipe(
          tap(() => {
            this.isSub = true;
          })
        )
        .subscribe(
          () => {
            this.alertify.success('Register successful...');
            this.registerForm.reset();
          },
          (err) => console.log('error in registration...'),
          () => {
            this.loginSubs$ = this.authService
              .login(this.user)
              .pipe(
                tap(() => {
                  this.isLoginSub = true;
                })
              )
              .subscribe(() => {
                this.router.navigate(['/user/members']);
              });
          }
        );
      this.isSub = true;
    }
  }

  cancel(): void {
    this.cancelReg.emit(false);
  }
}
