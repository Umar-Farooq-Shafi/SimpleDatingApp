import { tap } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { Component, OnInit, Input, OnDestroy } from '@angular/core';

import { AlertifyService } from './../../../_service/alertify.service';
import { AuthService } from './../../../_service/auth.service';
import { UserService } from 'src/app/_service/user.service';
import { Message } from './../../../_models/message';

@Component({
  selector: 'app-member-message',
  templateUrl: './member-message.component.html',
  styleUrls: ['./member-message.component.css'],
})
export class MemberMessageComponent implements OnInit, OnDestroy {
  @Input() recipientId: number;
  messages: Message[];
  private sub$: Subscription;
  private isSub = false;
  private sendSub$: Subscription;
  private isSendSub = false;
  newMessage: any = {};

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private alerty: AlertifyService
  ) {}

  ngOnDestroy(): void {
    if (this.isSub) {
      this.sub$.unsubscribe();
      this.isSub = false;
    }
    if (this.isSendSub) {
      this.sendSub$.unsubscribe();
      this.isSendSub = false;
    }
  }

  ngOnInit(): void {
    this.loadMessages();
  }

  loadMessages(): void {
    const currentUserId = +this.authService.decodedToken.nameid;
    this.sub$ = this.userService
      .getMessageThread(this.authService.decodedToken.nameid, this.recipientId)
      .pipe(
        tap((messages) => {
          this.isSub = true;
          for (const message of messages) {
            if (
              message.isRead === false &&
              message.recipientId === currentUserId
            ) {
              this.userService.markAsRead(currentUserId, message.id);
            }
          }
        })
      )
      .subscribe(
        (messages) => {
          this.messages = messages;
        },
        (err) => this.alerty.error(err)
      );
  }

  sendMessage(): void {
    this.newMessage.recipientId = this.recipientId;

    this.sendSub$ = this.userService
      .sendMessage(this.authService.decodedToken.nameid, this.newMessage)
      .pipe(
        tap(() => {
          this.isSendSub = true;
        })
      )
      .subscribe(
        (message: Message) => {
          this.messages.unshift(message);
          this.newMessage.content = '';
        },
        (err) => this.alerty.error(err)
      );
  }
}
