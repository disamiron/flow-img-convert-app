import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpEvent,
  HttpHeaders,
  HttpProgressEvent,
} from '@angular/common/http';
import { catchError, Observable } from 'rxjs';
import { HttpResponse, QueryParams } from './base-http.type';
import { StorageService } from '../storage/storage.service';
import { StorageType } from '../storage/storage.type';
import { Token } from '../../interfaces';
import { MatSnackBar } from '@angular/material/snack-bar';

const DEFAULT_HEADERS = {
  accept: 'application/json',
  'content-type': 'multipart/form-data',
};

const AUTH_HEADERS = {
  Accept: 'application/json',
  'content-type': 'application/x-www-form-urlencoded;charset=UTF-8',
};

@Injectable({
  providedIn: 'root',
})
export class BaseHttpService {
  private readonly _baseHref = 'https://api.aspose.cloud';

  private readonly _model = '/v3.0';

  constructor(
    private _http: HttpClient,
    private _storageService: StorageService,
    private _snackBar: MatSnackBar
  ) {}

  public postData<R>(
    url: string,
    params: URLSearchParams
  ): Observable<HttpResponse<R>> {
    const headers = new HttpHeaders(AUTH_HEADERS);

    return this._http
      .post<HttpResponse<R>>(this._baseHref + url, params, {
        headers: headers,
      })
      .pipe(
        catchError<any, any>(() =>
          this._snackBar.open('Error', 'Close', {
            duration: 3000,
          })
        )
      );
  }

  public postBlobWithProgress<R>(
    url: string,
    params: QueryParams,
    file: File
  ): Observable<HttpEvent<HttpProgressEvent | HttpResponse<R>['data']>> {
    const data = new FormData();
    data.append('file', file, file.name);

    return this._http
      .post(this._baseHref + this._model + url, data, {
        headers: this._createDefaultHeaders(),
        params: params,
        reportProgress: true,
        observe: 'events',
        responseType: 'blob',
      })
      .pipe(
        catchError<any, any>(() =>
          this._snackBar.open('Error', 'Close', {
            duration: 3000,
          })
        )
      );
  }

  private _createDefaultHeaders() {
    const headers = new HttpHeaders(DEFAULT_HEADERS);
    const token = this._storageService.getItem<Token>(StorageType.Token);

    if (token?.access_token) {
      return headers.append('authorization', `Bearer ${token.access_token}`);
    }

    return headers;
  }
}
