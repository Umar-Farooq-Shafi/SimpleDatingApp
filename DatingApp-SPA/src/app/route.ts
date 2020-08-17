import { HomeComponent } from './home/home.component';
import { Routes } from '@angular/router';

export const appRoutes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: 'user',
    loadChildren: () =>
      import('./links/links.module').then((m) => m.LinksModule),
  },
  { path: '**', redirectTo: 'home', pathMatch: 'full' },
];
