import { Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';

export const appRoutes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: 'user',
    loadChildren: () =>
      import('./links/links.module').then((m) => m.LinksModule),
  },
  { path: '**', redirectTo: 'home', pathMatch: 'full' },
];
