import { AuthService } from '../_service/auth.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'],
})
export class NavComponent implements OnInit {
  loginForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });

  constructor(private authService: AuthService) {}

  ngOnInit(): void {}

  onSubmit(): void {
    this.authService.login(this.loginForm.value).subscribe(
      (next) => {
        console.log('Login successfully');
      },
      (err) => console.log('Error in login')
    );
  }

  loggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  logout(): void {
    localStorage.removeItem('token');
    console.log('Logged out...');
  }
}
