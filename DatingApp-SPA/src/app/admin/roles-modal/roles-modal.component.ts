import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

import { User } from './../../_models/user';

@Component({
  selector: 'app-roles-modal',
  templateUrl: './roles-modal.component.html',
  styleUrls: ['./roles-modal.component.css']
})
export class RolesModalComponent implements OnInit {
  user: User;
  roles: Array<any>;
  @Output() updateSelectedRole = new EventEmitter();

  constructor(public bsModalRef: BsModalRef) {}

  ngOnInit(): void {
  }

  updateRoles(): void {
    this.updateSelectedRole.emit(this.roles);
    this.bsModalRef.hide();
  }

}
