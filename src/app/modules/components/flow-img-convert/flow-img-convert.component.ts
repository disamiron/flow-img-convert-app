import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { finalize, Subscription, take } from 'rxjs';
import { AsposeService } from 'src/app/shared/services/aspose/aspose.service';
import { NgxDropzoneChangeEvent } from 'ngx-dropzone';
import { HttpEventType } from '@angular/common/http';
import { ImageObject } from 'src/app/shared/interfaces';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { DomSanitizer } from '@angular/platform-browser';
import {
  limitLoadedFiles,
  limitLoadedFilesMsg,
  limitLoadingFiles,
  outputFormats,
  wrongFileType,
} from 'src/app/shared/constants';
import { MatDialog } from '@angular/material/dialog';
import { AuthComponent } from 'src/app/shared/components/auth/auth.component';
import { StorageService } from 'src/app/shared/services/storage/storage.service';
import { StorageType } from 'src/app/shared/services/storage/storage.type';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup } from '@angular/forms';

@UntilDestroy()
@Component({
  selector: 'app-flow-img-convert',
  templateUrl: './flow-img-convert.component.html',
  styleUrls: ['./flow-img-convert.component.scss'],
})
export class FlowImgConvertComponent implements OnInit {
  title = 'flow-img-convert-app';

  public loadedFiles: ImageObject[] = [];

  public boofer: File[] = [];

  private _limitFiles: number = limitLoadedFiles;

  public loadingCount: number = 0;

  private _limitLoadingCount: number = limitLoadingFiles;

  public loadingArray: {
    id: number;
    progress: number;
  }[] = [];

  public loaded!: number | null;

  public progress!: number | null;

  public loadingId: number = 0;

  public isUserNeedToAuth: boolean = true;

  public readonly outputFormats = outputFormats;

  public outputFormGroup: FormGroup = this._fb.group({
    outputFormat: [outputFormats[0].value],
  });

  constructor(
    private _aspose: AsposeService,
    private _cdr: ChangeDetectorRef,
    private sanitizer: DomSanitizer,
    private _dialog: MatDialog,
    private _storage: StorageService,
    private _snackBar: MatSnackBar,
    private _fb: FormBuilder
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
          this._snackBarOpen('Success');
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
    if (this.boofer.length && this.loadingCount < this._limitLoadingCount) {
      this._startConvertImg();
    }
  }

  private _startConvertImg(): void {
    this.loadingCount += 1;
    const file = this.boofer[0];

    this.boofer.shift();

    this._checkBoofer();

    let loadingId = this.loadingId;
    this.loadingArray.push({
      id: loadingId,
      progress: 0,
    });
    this.loadingId += 1;

    const sub = this._aspose
      .convertImg(file, this.outputFormGroup.value.outputFormat)
      .pipe(
        untilDestroyed(this),
        finalize(() => {
          this._stopUploadFile(sub);
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
          this.loadingCount -= 1;

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
