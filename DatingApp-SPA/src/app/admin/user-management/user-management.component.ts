import { tap } from 'rxjs/operators';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subscription } from 'rxjs';

import { RolesModalComponent } from '../roles-modal/roles-modal.component';
import { User } from './../../_models/user';
import { AdminService } from './../../_service/admin.service';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit, OnDestroy {
  users: User[];
  private getUsersWithRolesSubs: Subscription;
  bsModalRef: BsModalRef;
  private updateSelectedRoleSub: Subscription;
  private updateSelectedRoleIsSub = false;
  private updateUserRolesSub: Subscription;
  private updateUserRolesIsSub = false;

  constructor(private modalService: BsModalService, private adminService: AdminService) {}

  editRolesModal(user: User): void {
    const initialState = {
      user,
      roles: this.getRolesArray(user)
    };
    this.bsModalRef = this.modalService.show(RolesModalComponent, {initialState});
    this.updateSelectedRoleSub = this.bsModalRef.content.updateSelectedRole
    .pipe(tap(() => {
      this.updateSelectedRoleIsSub = true;
    }))
    .subscribe(values => {
      const rolesToUpdate = {
        roleNames: [...values.filter(el => el.checked === true).map(el => el.name)]
      };

      if (rolesToUpdate) {
        this.updateUserRolesSub = this.adminService.updateUserRoles(user, rolesToUpdate)
        .pipe(tap(() => {
          this.updateUserRolesIsSub = true;
        }))
        .subscribe(() => {
          user.roles = [...rolesToUpdate.roleNames];
        }, err => console.log(err));
      }
    });
  }

  ngOnDestroy(): void {
    this.getUsersWithRolesSubs.unsubscribe();

    if (this.updateSelectedRoleIsSub) {
      this.updateSelectedRoleSub.unsubscribe();

      if (this.updateUserRolesIsSub) {
        this.updateUserRolesSub.unsubscribe();
      }
    }
  }

  ngOnInit(): void {
    this.getUsersWithRoles();
  }

  getUsersWithRoles(): void {
    this.getUsersWithRolesSubs = this.adminService.getUsersWithRoles()
      .subscribe((user: User[]) => {
        this.users = user;
      }, err => console.log(err));
  }

  private getRolesArray(user: User): Array<User> {
    const roles = [];
    const userRoles = user.roles;
    const availableRoles = [
      {name: 'Admin', value: 'Admin', checked: false},
      {name: 'Moderator', value: 'Moderator', checked: false},
      {name: 'Member', value: 'Member', checked: false},
      {name: 'VIP', value: 'VIP', checked: false},
    ];

    for (const i of availableRoles) {
      let isMatch = false;

      for (const j of userRoles) {
        if (i.name === j) {
          isMatch = true;
          i.checked = true;
          roles.push(i);
          break;
        }
      }

      if (!isMatch) {
        roles.push(i);
      }
    }

    return roles;
  }
}
