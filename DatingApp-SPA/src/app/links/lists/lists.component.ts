import { tap } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';

import { AlertifyService } from './../../_service/alertify.service';
import { AuthService } from './../../_service/auth.service';
import { Pagination, PaginatedResult } from './../../_models/pagination';
import { User } from './../../_models/user';
import { UserService } from 'src/app/_service/user.service';

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.css'],
})
export class ListsComponent implements OnInit, OnDestroy {
  users: User[];
  pagination: Pagination;
  likesParam: string;
  private sub$: Subscription;
  private isSub = false;
  private likeSub$: Subscription;
  private isLikeSub = false;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private alertify: AlertifyService,
    private route: ActivatedRoute
  ) {}

  ngOnDestroy(): void {
    if (this.isSub) {
      this.sub$.unsubscribe();
      this.isSub = false;
    }
    if (this.isLikeSub) {
      this.likeSub$.unsubscribe();
      this.isLikeSub = false;
    }
  }

  ngOnInit(): void {
    this.sub$ = this.route.data
      .pipe(
        tap(() => {
          this.isSub = true;
        })
      )
      .subscribe((data: any) => {
        this.users = data.users.result;
        this.pagination = data.users.pagination;
      });
    this.likesParam = 'Likers';
  }

  loadUser(): void {
    this.likeSub$ = this.userService
      .getUsers(
        this.pagination.currentPage,
        this.pagination.itemsPerPage,
        null,
        this.likesParam
      )
      .pipe(
        tap(() => {
          this.isLikeSub = true;
        })
      )
      .subscribe(
        (res: PaginatedResult<User[]>) => {
          this.users = res.result;
          this.pagination = res.pagination;
        },
        (err) => this.alertify.error(err)
      );
  }

  pageChanged(event: any): void {
    this.pagination.currentPage = event.page;
    this.loadUser();
  }
}
