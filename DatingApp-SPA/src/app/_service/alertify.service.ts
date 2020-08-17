import { Injectable } from '@angular/core';
declare let alertify: any;

@Injectable({
  providedIn: 'root',
})
export class AlertifyService {
  constructor() {}

  confirm(message: string, okCallBack: () => any): void {
    alertify.confirm(message, function (e) {
      if (e) {
        okCallBack();
      }
    });
  }

  success(message): void {
    alertify.success(message);
  }

  error(message): void {
    alertify.error(message);
  }

  warning(message) {
    alertify.warning(message);
  }

  message(message): void {
    alertify.message(message);
  }
}
