import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Components
import { ListsComponent } from './lists/lists.component';
import { MessagesComponent } from './messages/messages.component';
import { MemberListComponent } from './members/member-list/member-list.component';
import { MemberDetailComponent } from './members/member-detail/member-detail.component';
import { MemberEditComponent } from './members/member-edit/member-edit.component';

// Guards
import { PreventUnsavedChangesGuard } from './../_guards/prevent-unsaved-changes.guard';
import { AuthGuard } from './../_guards/auth.guard';

// Resolvers
import { MemberDetailResolver } from './../_resolvers/member-details.resolver';
import { MemberEditResolver } from '../_resolvers/member-edit.resolver';
import { MemberListResolver } from '../_resolvers/member-list.resolver';
import { ListsResolver } from '../_resolvers/lists.resolver';
import { MessagesResolver } from '../_resolvers/messages.resolver';

const routes: Routes = [
  {
    path: '',
    runGuardsAndResolvers: 'always',
    canActivate: [AuthGuard],
    children: [
      {
        path: 'members',
        component: MemberListComponent,
        resolve: { users: MemberListResolver },
      },
      {
        path: 'members/:id',
        component: MemberDetailComponent,
        resolve: { user: MemberDetailResolver },
      },
      {
        path: 'member/edit',
        component: MemberEditComponent,
        resolve: { user: MemberEditResolver },
        canDeactivate: [PreventUnsavedChangesGuard],
      },
      {
        path: 'messages',
        component: MessagesComponent,
        resolve: { messages: MessagesResolver },
      },
      {
        path: 'lists',
        component: ListsComponent,
        resolve: { users: ListsResolver },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LinksRoutingModule {}
