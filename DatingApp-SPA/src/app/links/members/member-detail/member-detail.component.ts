import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { tap } from 'rxjs/operators';
import {
  NgxGalleryOptions,
  NgxGalleryImage,
  NgxGalleryAnimation,
} from 'ngx-gallery-9';

import { AlertifyService } from './../../../_service/alertify.service';
import { UserService } from './../../../_service/user.service';
import { User } from './../../../_models/user';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css'],
})
export class MemberDetailComponent implements OnInit, OnDestroy {
  user: User;
  private sub$: Subscription;
  private isSubs = false;
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];

  constructor(private route: ActivatedRoute) {}

  ngOnDestroy(): void {
    if (this.isSubs) {
      this.sub$.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.sub$ = this.route.data
      .pipe(
        tap(() => {
          this.isSubs = true;
        })
      )
      .subscribe((data) => {
        this.user = data.user;
      });

    this.galleryOptions = [
      {
        width: '600px',
        height: '400px',
        imagePercent: 100,
        thumbnailsColumns: 4,
        imageAnimation: NgxGalleryAnimation.Slide,
        preview: false,
      },
    ];

    this.galleryImages = this.getImages();
  }

  getImages(): Array<any> {
    const images = [];
    for (const photo of this.user.photos) {
      images.push({
        small: photo.url,
        medium: photo.url,
        big: photo.url,
      });
    }

    return images;
  }
}
