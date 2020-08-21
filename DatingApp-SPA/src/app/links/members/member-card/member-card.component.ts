import { tap } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { Component, Input, OnDestroy } from '@angular/core';

import { AlertifyService } from './../../../_service/alertify.service';
import { User } from 'src/app/_models/user';
import { UserService } from './../../../_service/user.service';
import { AuthService } from './../../../_service/auth.service';
@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrls: ['./member-card.component.css'],
})
export class MemberCardComponent implements OnDestroy {
  @Input() user: User;
  private sub$: Subscription;
  private isSub = false;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private alertify: AlertifyService
  ) {}

  ngOnDestroy(): void {
    if (this.isSub) {
      this.sub$.unsubscribe();
      this.isSub = false;
    }
  }

  sendLike(id: number): void {
    this.sub$ = this.userService
      .sendLike(this.authService.decodedToken.nameid, id)
      .pipe(
        tap(() => {
          this.isSub = true;
        })
      )
      .subscribe(
        (data: any) => {
          this.alertify.success(`You have like ${this.user.knownAs}`);
        },
        (err) => this.alertify.error(err)
      );
  }
}
