import { PreventUnsavedChangesGuard } from './../_guards/prevent-unsaved-changes.guard';
import { MemberEditComponent } from './members/member-edit/member-edit.component';
import { MemberDetailResolver } from './../_resolvers/member-details.resolver';
import { AuthGuard } from './../_guards/auth.guard';
import { ListsComponent } from './lists/lists.component';
import { MessagesComponent } from './messages/messages.component';
import { MemberListComponent } from './members/member-list/member-list.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MemberDetailComponent } from './members/member-detail/member-detail.component';
import { MemberEditResolver } from '../_resolvers/member-edit.resolver';

const routes: Routes = [
  {
    path: '',
    runGuardsAndResolvers: 'always',
    canActivate: [AuthGuard],
    children: [
      {
        path: 'members',
        component: MemberListComponent,
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
      { path: 'messages', component: MessagesComponent },
      { path: 'lists', component: ListsComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LinksRoutingModule {}
