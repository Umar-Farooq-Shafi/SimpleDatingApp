import { tap } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';

import { AdminService } from './../../_service/admin.service';

@Component({
  selector: 'app-photo-management',
  templateUrl: './photo-management.component.html',
  styleUrls: ['./photo-management.component.css']
})
export class PhotoManagementComponent implements OnInit, OnDestroy {
  photos: any;
  private photosForApprovalSub: Subscription;
  private ApprovePhotoSub: Subscription;
  private ApprovePhotoIsSub = false;
  private rejectPhotoSub: Subscription;
  private rejectPhotoIsSub = false;

  constructor(private adminService: AdminService) { }

  ngOnDestroy(): void {
    this.photosForApprovalSub.unsubscribe();

    if (this.ApprovePhotoIsSub) {
      this.ApprovePhotoSub.unsubscribe();
    }

    if (this.rejectPhotoIsSub) {
      this.rejectPhotoSub.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.photosForApprovalSub = this.adminService.getPhotosForApproval()
      .subscribe(photos => {
        this.photos = photos;
      }, err => console.log(err));
  }

  approvePhoto(photoId: number): void {
    this.ApprovePhotoSub = this.adminService.approvePhoto(photoId)
      .pipe(tap(() => {
        this.ApprovePhotoIsSub = true;
      }))
      .subscribe(() => {
        this.photos.splice(this.photos.findIndex(p => p.id === photoId), 1);
      }, err => console.log(err));
  }

  rejectPhoto(photoId: number): void {
    this.rejectPhotoSub = this.adminService.rejectPhoto(photoId)
      .pipe(tap(() => {
        this.rejectPhotoIsSub = true;
      }))
      .subscribe(() => {
        this.photos.splice(this.photos.findIndex(p => p.id === photoId), 1);
      }, err => console.log(err));
  }
}
