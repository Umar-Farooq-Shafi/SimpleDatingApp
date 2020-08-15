import { ValueService } from './../value.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-value',
  templateUrl: './value.component.html',
  styleUrls: ['./value.component.css'],
})
export class ValueComponent implements OnInit, OnDestroy {
  private subs$: Subscription;
  private isSub = false;
  values: Array<any> = [];

  constructor(private service: ValueService) {}

  ngOnDestroy(): void {
    if (this.isSub) {
      this.subs$.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.subs$ = this.service.getValues().subscribe(
      (res) => {
        this.values = res;
        this.isSub = true;
      },
      (err) => {
        console.log(err);
      }
    );
  }
}
