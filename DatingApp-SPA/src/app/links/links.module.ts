import { AuthGuard } from './../_guards/auth.guard';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LinksRoutingModule } from './links-routing.module';
import { MessagesComponent } from './messages/messages.component';
import { ListsComponent } from './lists/lists.component';
import { MemberListComponent } from './member-list/member-list.component';

@NgModule({
  declarations: [MessagesComponent, ListsComponent, MemberListComponent],
  imports: [CommonModule, LinksRoutingModule],
  providers: [AuthGuard],
})
export class LinksModule {}
