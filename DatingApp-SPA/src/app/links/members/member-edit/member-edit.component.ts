import { UserService } from './../../../_service/user.service';
import { AlertifyService } from './../../../_service/alertify.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  HostListener,
} from '@angular/core';
import { User } from 'src/app/_models/user';
import { tap } from 'rxjs/operators';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/_service/auth.service';

@Component({
  selector: 'app-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrls: ['./member-edit.component.css'],
})
export class MemberEditComponent implements OnInit, OnDestroy {
  user: User;
  private sub$: Subscription;
  private isSub = false;
  @ViewChild('editForm') editForm: NgForm;

  constructor(
    private route: ActivatedRoute,
    private alertify: AlertifyService,
    private authService: AuthService,
    private userService: UserService
  ) {}

  ngOnDestroy(): void {
    if (this.isSub) {
      this.sub$.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.sub$ = this.route.data
      .pipe(
        tap(() => {
          this.isSub = true;
        })
      )
      .subscribe((data) => {
        this.user = data.user;
      });
  }

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: KeyboardEvent): void {
    if (this.editForm.dirty) {
      $event.returnValue = true;
    }
  }

  updateUser(): void {
    this.sub$ = this.userService
      .updateUser(this.authService.decodedToken.nameid, this.user)
      .pipe(
        tap(() => {
          this.isSub = true;
        })
      )
      .subscribe(
        () => {
          this.alertify.success('Profile updated successfully');
          this.editForm.reset(this.user);
        },
        (err) => this.alertify.error(err)
      );
  }
}
