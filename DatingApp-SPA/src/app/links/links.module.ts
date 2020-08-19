import { PreventUnsavedChangesGuard } from './../_guards/prevent-unsaved-changes.guard';
import { FormsModule } from '@angular/forms';
import { MemberEditComponent } from './members/member-edit/member-edit.component';
import { MemberDetailComponent } from './members/member-detail/member-detail.component';
import { MemberCardComponent } from './members/member-card/member-card.component';
import { AuthGuard } from './../_guards/auth.guard';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { NgxGalleryModule } from 'ngx-gallery-9';

import { LinksRoutingModule } from './links-routing.module';
import { MessagesComponent } from './messages/messages.component';
import { ListsComponent } from './lists/lists.component';
import { MemberListComponent } from './members/member-list/member-list.component';
import { MemberDetailResolver } from '../_resolvers/member-details.resolver';
import { MemberEditResolver } from '../_resolvers/member-edit.resolver';

@NgModule({
  declarations: [
    MessagesComponent,
    ListsComponent,
    MemberListComponent,
    MemberCardComponent,
    MemberDetailComponent,
    MemberEditComponent,
  ],
  imports: [
    CommonModule,
    LinksRoutingModule,
    TabsModule.forRoot(),
    NgxGalleryModule,
    FormsModule,
  ],
  providers: [
    AuthGuard,
    MemberDetailResolver,
    MemberEditResolver,
    PreventUnsavedChangesGuard,
  ],
})
export class LinksModule {}
