import { AlertifyService } from './../../../_service/alertify.service';
import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { User } from 'src/app/_models/user';
import { UserService } from 'src/app/_service/user.service';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css'],
})
export class MemberListComponent implements OnInit, OnDestroy {
  private sub$: Subscription;
  private isSub = false;
  users: User[];

  constructor(
    private userService: UserService,
    private alertify: AlertifyService
  ) {}

  ngOnDestroy(): void {
    if (this.isSub) {
      this.sub$.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.sub$ = this.userService.getUsers().subscribe(
      (res: User[]) => {
        this.users = res;
      },
      (err) => this.alertify.error(err)
    );
    this.isSub = true;
  }
}
