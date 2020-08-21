import { tap } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';

import { UserService } from './../../_service/user.service';
import { AuthService } from './../../_service/auth.service';
import { Pagination, PaginatedResult } from './../../_models/pagination';
import { Message } from './../../_models/message';
import { AlertifyService } from './../../_service/alertify.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css'],
})
export class MessagesComponent implements OnInit, OnDestroy {
  messages: Message[];
  pagination: Pagination;
  messageContainer = 'Unread';
  private sub$: Subscription;
  private isSub = false;
  private messageSub$: Subscription;
  private isMessageSub = false;
  private deleteSub$: Subscription;
  private isDeleteSub = false;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private route: ActivatedRoute,
    private alertify: AlertifyService
  ) {}

  ngOnDestroy(): void {
    if (this.isSub) {
      this.sub$.unsubscribe();
      this.isSub = false;
    }
    if (this.isMessageSub) {
      this.messageSub$.unsubscribe();
      this.isMessageSub = false;
    }
    if (this.isDeleteSub) {
      this.deleteSub$.unsubscribe();
      this.isDeleteSub = false;
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
        this.messages = data.messages.result;
        this.pagination = data.messages.pagination;
      });
  }

  loadMessages(): void {
    this.messageSub$ = this.userService
      .getMessages(
        this.authService.decodedToken.nameid,
        this.pagination.currentPage,
        this.pagination.itemsPerPage,
        this.messageContainer
      )
      .pipe(
        tap(() => {
          this.isMessageSub = true;
        })
      )
      .subscribe(
        (res: PaginatedResult<Message[]>) => {
          this.messages = res.result;
          this.pagination = res.pagination;
        },
        (err) => this.alertify.error(err)
      );
  }

  pageChanged(event: any): void {
    this.pagination.currentPage = event.page;
    this.loadMessages();
  }

  deleteMessage(id: number): void {
    this.alertify.confirm('Are you sure you want to delete...', () => {
      this.deleteSub$ = this.userService
        .deleteMessage(id, this.authService.decodedToken.nameid)
        .pipe(
          tap(() => {
            this.isDeleteSub = true;
          })
        )
        .subscribe(
          () => {
            this.messages.splice(
              this.messages.findIndex((m) => m.id === id),
              1
            );
            this.alertify.success('Deleted successfully...');
          },
          (err) => this.alertify.error(`Error in deleting... ${err}`)
        );
    });
  }
}
