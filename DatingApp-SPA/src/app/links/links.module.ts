import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Bootstrap
import { TabsModule } from 'ngx-bootstrap/tabs';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ButtonsModule } from 'ngx-bootstrap/buttons';

// Gallery Viewers
import { NgxGalleryModule } from 'ngx-gallery-9';

// File Uploader
import { FileUploadModule } from 'ng2-file-upload';

// Components
import { MessagesComponent } from './messages/messages.component';
import { MemberMessageComponent } from './members/member-message/member-message.component';
import { ListsComponent } from './lists/lists.component';
import { MemberListComponent } from './members/member-list/member-list.component';
import { PhotoEditorComponent } from './members/photo-editor/photo-editor.component';
import { MemberEditComponent } from './members/member-edit/member-edit.component';
import { MemberDetailComponent } from './members/member-detail/member-detail.component';
import { MemberCardComponent } from './members/member-card/member-card.component';

// Route
import { LinksRoutingModule } from './links-routing.module';

// Resolvers
import { MemberDetailResolver } from '../_resolvers/member-details.resolver';
import { MemberEditResolver } from '../_resolvers/member-edit.resolver';
import { ListsResolver } from '../_resolvers/lists.resolver';
import { MessagesResolver } from '../_resolvers/messages.resolver';

// Guards
import { PreventUnsavedChangesGuard } from './../_guards/prevent-unsaved-changes.guard';
import { AuthGuard } from './../_guards/auth.guard';
import { MemberListResolver } from '../_resolvers/member-list.resolver';

@NgModule({
  declarations: [
    MessagesComponent,
    ListsComponent,
    MemberListComponent,
    MemberCardComponent,
    MemberDetailComponent,
    MemberEditComponent,
    PhotoEditorComponent,
    MemberMessageComponent,
  ],
  imports: [
    CommonModule,
    LinksRoutingModule,
    TabsModule.forRoot(),
    PaginationModule.forRoot(),
    ButtonsModule.forRoot(),
    NgxGalleryModule,
    FormsModule,
    FileUploadModule,
  ],
  providers: [
    AuthGuard,
    MemberDetailResolver,
    MemberEditResolver,
    PreventUnsavedChangesGuard,
    MemberListResolver,
    ListsResolver,
    MessagesResolver,
  ],
})
export class LinksModule {}
