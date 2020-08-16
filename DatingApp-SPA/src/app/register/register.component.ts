import { AuthService } from './../_service/auth.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  OnDestroy,
} from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit, OnDestroy {
  @Output() cancelReg = new EventEmitter();
  private subs$: Subscription;
  private isSub = false;

  registerForm = new FormGroup({
    username: new FormControl('', [
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(8),
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(8),
    ]),
  });

  constructor(private service: AuthService) {}

  ngOnDestroy(): void {
    if (this.isSub) {
      this.subs$.unsubscribe();
    }
  }

  ngOnInit(): void {}

  register(): void {
    this.subs$ = this.service.register(this.registerForm.value).subscribe(
      () => {
        console.log('Register successful...');
        this.isSub = true;
        this.registerForm.reset();
      },
      (err) => console.log('error in registration...')
    );
  }

  cancel(): void {
    this.cancelReg.emit(false);
  }
}
