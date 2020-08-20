import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';

import { User } from 'src/app/_models/user';
import { UserService } from 'src/app/_service/user.service';
import { Pagination, PaginatedResult } from './../../../_models/pagination';
import { AlertifyService } from './../../../_service/alertify.service';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css'],
})
export class MemberListComponent implements OnInit, OnDestroy {
  private sub$: Subscription;
  private isSub = false;
  users: User[];
  pagination: Pagination;
  user: User = JSON.parse(localStorage.getItem('user'));
  genderList = [
    {
      value: 'male',
      display: 'Males',
    },
    {
      value: 'female',
      display: 'Females',
    },
  ];
  userParams: any = {};

  constructor(
    private alertify: AlertifyService,
    private route: ActivatedRoute,
    private userService: UserService
  ) {}

  ngOnDestroy(): void {
    if (this.isSub) {
      this.sub$.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.sub$ = this.route.data.subscribe(
      (data) => {
        this.users = data.users.result;
        this.pagination = data.users.pagination;
      },
      (err) => this.alertify.error(err)
    );
    this.isSub = true;

    this.userParams.gender = this.user.gender === 'male' ? 'female' : 'male';
    this.userParams.minAge = 18;
    this.userParams.maxAge = 99;
    this.userParams.orderBy = 'lastActive';
  }

  pageChanged(event: any): void {
    this.pagination.currentPage = event.page;
    this.loadUser();
  }

  resetFilters(): void {
    this.userParams.gender = this.user.gender === 'male' ? 'female' : 'male';
    this.userParams.minAge = 18;
    this.userParams.maxAge = 99;

    this.loadUser();
  }

  loadUser(): void {
    this.sub$ = this.userService
      .getUsers(
        this.pagination.currentPage,
        this.pagination.itemsPerPage,
        this.userParams
      )
      .subscribe(
        (res: PaginatedResult<User[]>) => {
          this.users = res.result;
          this.pagination = res.pagination;
          this.isSub = true;
        },
        (err) => this.alertify.error(err)
      );
  }
}
