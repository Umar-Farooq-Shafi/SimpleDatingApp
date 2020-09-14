import { tap } from 'rxjs/operators';
import {
  Component,
  OnInit,
  Input,
  OnDestroy,
  Output,
  EventEmitter,
} from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { Subscription } from 'rxjs';

import { AuthService } from 'src/app/_service/auth.service';
import { environment } from './../../../../environments/environment';
import { Photo } from './../../../_models/Photo';
import { UserService } from './../../../_service/user.service';
import { AlertifyService } from './../../../_service/alertify.service';

@Component({
  selector: 'app-photo-editor',
  templateUrl: './photo-editor.component.html',
  styleUrls: ['./photo-editor.component.css'],
})
export class PhotoEditorComponent implements OnInit, OnDestroy {
  @Input() photos: Photo[];
  uploader: FileUploader;
  hasBaseDropZoneOver: boolean;
  private readonly URL = environment.apiUrl;
  private sub$: Subscription;
  private isSub = false;
  private photoSub$: Subscription;
  private isPhotoSub = false;
  private currentMain: Photo;
  @Output() getMemberPhotoChange = new EventEmitter<string>();

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private alertify: AlertifyService
  ) {}

  ngOnDestroy(): void {
    if (this.isSub) {
      this.sub$.unsubscribe();
    }
    if (this.isPhotoSub) {
      this.photoSub$.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.uploader = new FileUploader({
      url: `${this.URL}users/${this.authService.decodedToken.nameid}/photos`,
      authToken: `Bearer ${localStorage.getItem('token')}`,
      isHTML5: true,
      allowedFileType: ['image'],
      removeAfterUpload: true,
      autoUpload: false,
      maxFileSize: 10 * 1024 * 1024,
    });

    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false;
    };

    this.uploader.onSuccessItem = (item, res, status, headers) => {
      if (res) {
        const r: Photo = JSON.parse(res);
        const photo = {
          id: r.id,
          url: r.url,
          dateAdded: r.dateAdded,
          description: r.description,
          isMain: r.isMain,
          isApproved: r.isApproved
        };

        this.photos.push(photo);

        if (photo.isMain) {
          this.authService.changeMemberPhoto(photo.url);
          this.authService.currentUser.photoUrl = photo.url;
          localStorage.setItem(
            'user',
            JSON.stringify(this.authService.currentUser)
          );
        }
      }
    };
  }

  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  setMain(photo: Photo): void {
    this.sub$ = this.userService
      .setMainPhoto(this.authService.decodedToken.nameid, photo.id)
      .pipe(
        tap(() => {
          this.isSub = true;
          this.currentMain = this.photos.filter((p) => p.isMain)[0];
          this.currentMain.isMain = false;
          photo.isMain = true;
          this.authService.changeMemberPhoto(photo.url);
          this.authService.currentUser.photoUrl = photo.url;
          localStorage.setItem(
            'user',
            JSON.stringify(this.authService.currentUser)
          );
          this.getMemberPhotoChange.emit(photo.url);
        })
      )
      .subscribe(
        () => this.alertify.error('Successfully set main photo'),
        (err) => console.log(err)
      );
  }

  deletePhoto(id: number): void {
    this.alertify.confirm('Are you sure you want to delete', () => {
      this.photoSub$ = this.userService
        .deletePhoto(this.authService.decodedToken.nameid, id)
        .pipe(
          tap(() => {
            this.isPhotoSub = true;
          })
        )
        .subscribe(
          () => {
            this.photos.splice(
              this.photos.findIndex((p) => p.id === id),
              1
            );
            this.alertify.success('Photo has been deleted');
          },
          (err) => this.alertify.error(err)
        );
    });
  }
}
