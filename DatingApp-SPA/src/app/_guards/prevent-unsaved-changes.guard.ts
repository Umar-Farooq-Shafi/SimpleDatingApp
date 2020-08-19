import { Injectable } from '@angular/core';
import {
  CanDeactivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { MemberEditComponent } from '../links/members/member-edit/member-edit.component';

@Injectable({
  providedIn: 'root',
})
export class PreventUnsavedChangesGuard
  implements CanDeactivate<MemberEditComponent> {
  canDeactivate(
    component: MemberEditComponent,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (component.editForm.dirty) {
      return confirm(
        'Are you sure you want to continue? Any unsaved changes will be lost'
      );
    }
    return true;
  }
}
