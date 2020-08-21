import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { tap } from 'rxjs/operators';
import {
  NgxGalleryOptions,
  NgxGalleryImage,
  NgxGalleryAnimation,
} from 'ngx-gallery-9';
import { TabsetComponent } from 'ngx-bootstrap/tabs';

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
  private querySub$: Subscription;
  private isQuerySubs = false;
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];
  @ViewChild('memberTabs', { static: true }) memberTabs: TabsetComponent;

  constructor(private route: ActivatedRoute) {}

  ngOnDestroy(): void {
    if (this.isSubs) {
      this.sub$.unsubscribe();
      this.isSubs = false;
    }
    if (this.isQuerySubs) {
      this.querySub$.unsubscribe();
      this.isQuerySubs = false;
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

    this.querySub$ = this.route.queryParams
      .pipe(
        tap(() => {
          this.isQuerySubs = true;
        })
      )
      .subscribe((params) => {
        const selectedTab: number = params.tab;
        if (selectedTab) {
          this.selectTab(selectedTab);
        } else {
          this.selectTab(0);
        }
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

  selectTab(tabId: number): void {
    this.memberTabs.tabs[tabId].active = true;
  }
}
