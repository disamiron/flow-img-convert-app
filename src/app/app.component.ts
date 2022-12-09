import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { finalize, Subscription } from 'rxjs';
import { AsposeService } from './shared/services/aspose/aspose.service';
import { NgxDropzoneChangeEvent } from 'ngx-dropzone';
import { HttpEventType } from '@angular/common/http';
import { ImageObject } from './shared/interfaces';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { DomSanitizer } from '@angular/platform-browser';
import { limitLoadedFiles, limitLoadingFiles } from './shared/constants';

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

  private _sub: Subscription = new Subscription();

  constructor(
    private _aspose: AsposeService,
    private _cdr: ChangeDetectorRef,
    private sanitizer: DomSanitizer
  ) {}

  public ngOnInit(): void {
    this._aspose
      .getToken()
      .pipe()
      .subscribe((v) => {
        console.log(v);
      });
  }

  public sanitize(url: string) {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  public onFileUpload(event: NgxDropzoneChangeEvent) {
    if (
      event.addedFiles.length &&
      this.boofer.length + this.loadedFiles.length <=
        this._limitFiles - event.addedFiles.length
    ) {
      this.boofer.push(...event.addedFiles);
    } else {
      return;
    }
    if (this._loadingCount < this._limitLoadingCount) {
      this._startConvertImg();
    }
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
    // this._sub = this._aspose
    this._aspose
      .convertImg(file)
      .pipe(
        untilDestroyed(this),
        finalize(() => {
          // this._stopUploadFile();
          this._checkBoofer();
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
          // const data = res.body as HttpResponse<Blob>;
          const data = res.body as any;
          var urlCreator = window.URL || window.webkitURL;
          var imageUrl = urlCreator.createObjectURL(data);

          const imgObj = {
            image: imageUrl,
            url: null,
            id: null,
          };
          this._loadingCount -= 1;
          this.loadedFiles.push(imgObj);
          let index = this.loadingArray.findIndex(
            (info) => info.id === loadingId
          );
          this.loadingArray.splice(index, 1);
          this._cdr.markForCheck();
          this._sub.unsubscribe();
        }
      });
  }

  private _stopUploadFile(): void {
    this._sub.unsubscribe();
    // this.loaded = null;
    // this.progress = null;
    // if (this.boofer.length && this._loadingCount < this._limitLoadingCount) {
    //   this._startConvertImg();
    // }
  }
}
