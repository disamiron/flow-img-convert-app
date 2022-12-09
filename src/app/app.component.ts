import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { finalize, Subscription, take } from 'rxjs';
import { AsposeService } from './shared/services/aspose/aspose.service';
import { NgxDropzoneChangeEvent } from 'ngx-dropzone';
import { HttpEventType } from '@angular/common/http';
import { ImageObject } from './shared/interfaces';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { DomSanitizer } from '@angular/platform-browser';
import {
  limitLoadedFiles,
  limitLoadedFilesMsg,
  limitLoadingFiles,
  wrongFileType,
} from './shared/constants';
import { MatDialog } from '@angular/material/dialog';
import { AuthComponent } from './shared/components/auth/auth.component';
import { StorageService } from './shared/services/storage/storage.service';
import { StorageType } from './shared/services/storage/storage.type';
import { MatSnackBar } from '@angular/material/snack-bar';

@UntilDestroy()
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'flow-img-convert-app';

  public loadedFiles: ImageObject[] = [];

  public boofer: File[] = [];

  private _limitFiles: number = limitLoadedFiles;

  public _loadingCount: number = 0;

  private _limitLoadingCount: number = limitLoadingFiles;

  public loadingArray: {
    id: number;
    progress: number;
  }[] = [];

  public loaded!: number | null;

  public progress!: number | null;

  public loadingId: number = 0;

  public isUserNeedToAuth: boolean = true;

  constructor(
    private _aspose: AsposeService,
    private _cdr: ChangeDetectorRef,
    private sanitizer: DomSanitizer,
    private _dialog: MatDialog,
    private _storage: StorageService,
    private _snackBar: MatSnackBar
  ) {}

  public ngOnInit(): void {
    this.authModal();
  }

  public authModal() {
    this._dialog
      .open(AuthComponent)
      .afterClosed()
      .pipe(take(1))
      .subscribe((v) => {
        if (v) {
          this._asposeAuth(v.clientId, v.clientSecret);
        }
      });
  }

  private _asposeAuth(clientId: string, clientSecret: string) {
    this._aspose
      .getToken(clientId, clientSecret)
      .pipe(untilDestroyed(this))
      .subscribe((token) => {
        if (token) {
          this._storage.setItem(StorageType.Token, token);
          this.isUserNeedToAuth = false;
        }
      });
  }

  public onFileUpload(event: NgxDropzoneChangeEvent) {
    if (event.rejectedFiles[0]) {
      this._snackBarOpen(wrongFileType);
      return;
    }
    if (
      event.addedFiles.length &&
      this.boofer.length + this.loadedFiles.length <=
        this._limitFiles - event.addedFiles.length
    ) {
      this.boofer.push(...event.addedFiles);
    } else {
      this._snackBarOpen(limitLoadedFilesMsg);
      return;
    }

    this._checkBoofer();
  }

  private _checkBoofer() {
    if (this.boofer.length && this._loadingCount < this._limitLoadingCount) {
      this._startConvertImg();
    }
  }

  private _startConvertImg(): void {
    this._loadingCount += 1;
    const file = this.boofer[0];

    this.boofer.shift();

    this._checkBoofer();

    let loadingId = this.loadingId;
    this.loadingArray.push({
      id: loadingId,
      progress: 0,
    });
    this.loadingId += 1;

    const _sub = this._aspose
      .convertImg(file)
      .pipe(
        untilDestroyed(this),
        finalize(() => {
          this._stopUploadFile(_sub);
        })
      )
      .subscribe((res) => {
        if (res.type === HttpEventType.UploadProgress) {
          let index = this.loadingArray.findIndex(
            (info) => info.id === loadingId
          );
          this.loadingArray[index].progress = Math.round(
            (100 * res.loaded) / (res.total as number)
          );

          this._cdr.markForCheck();
        }

        if (res.type === HttpEventType.Response) {
          const data = res.body as Blob;

          var urlCreator = window.URL || window.webkitURL;
          var imageUrl = urlCreator.createObjectURL(data);

          const imgObj = {
            image: imageUrl,
          };

          this.loadedFiles.unshift(imgObj);
          this._loadingCount -= 1;

          let index = this.loadingArray.findIndex(
            (info) => info.id === loadingId
          );

          this.loadingArray.splice(index, 1);

          this._cdr.markForCheck();
        }
      });
  }

  public sanitize(url: string) {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  private _snackBarOpen(msg: string) {
    this._snackBar.open(msg, 'Close', {
      duration: 3000,
    });
  }

  private _stopUploadFile(sub: Subscription): void {
    sub.unsubscribe();
    this._checkBoofer();
  }
}
