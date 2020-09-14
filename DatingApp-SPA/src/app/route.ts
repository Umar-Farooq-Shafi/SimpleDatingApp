import { AuthGuard } from './_guards/auth.guard';
import { Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { AdminPanelComponent } from './admin/admin-panel/admin-panel.component';

export const appRoutes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: 'user',
    loadChildren: () =>
      import('./links/links.module').then((m) => m.LinksModule),
  },
  { path: 'admin', component: AdminPanelComponent, canActivate: [AuthGuard], data: { roles: ['Admin', 'Moderator'] } },
  { path: '**', redirectTo: 'home', pathMatch: 'full' },
];
