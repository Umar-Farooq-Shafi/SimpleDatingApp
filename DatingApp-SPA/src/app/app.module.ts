import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavComponent } from './nav/nav.component';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { ErrorInterceptorProvider } from './_service/error.interceptor';
import { AlertifyService } from './_service/alertify.service';
import { appRoutes } from './route';
import { JwtModule } from '@auth0/angular-jwt';

export function tokenGetter(): string {
  return localStorage.getItem('token');
}

@NgModule({
  declarations: [AppComponent, NavComponent, HomeComponent, RegisterComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    BsDropdownModule.forRoot(),
    RouterModule.forRoot(appRoutes),
    JwtModule.forRoot({
      config: {
        tokenGetter,
        allowedDomains: ['localhost:5000'],
      },
    }),
  ],
  providers: [ErrorInterceptorProvider, AlertifyService],
  bootstrap: [AppComponent],
})
export class AppModule {}
