import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpEvent,
  HttpProgressEvent,
} from '@angular/common/http';
import { catchError, map, Observable } from 'rxjs';
import { HttpResponse } from './base-http.type';

const DEFAULT_HEADERS = {
  'X-Requested-With': 'XMLHttpRequest',
  'Cache-Control': 'no-cache',
  Pragma: 'no-cache',
};

@Injectable({
  providedIn: 'root',
})
export class BaseHttpService {
  private readonly _hred = 'https://api.aspose.cloud';
  private readonly _baseHref = 'https://api.aspose.cloud/v3.0';

  constructor(private _http: HttpClient) {}
  public postData<R>(url: string): Observable<HttpResponse<R>['data']> {
    let params = {
      grant_type: 'client_credentials',
      client_id: 'fc738139-5109-4260-81ef-df823e4db677',
      client_secret: '505071c48c9143a95aced04771bce5fd',
    };

    return this._http
      .post<HttpResponse<R>>(this._hred + url, params, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })
      .pipe(
        map((res) => {
          return res.data;
        })
      );
  }

  public postBlobWithProgress<R>(
    url: string,
    file: File
  ): Observable<HttpEvent<HttpProgressEvent | HttpResponse<R>>> {
    const data = new FormData();

    data.append('file', file, file.name);

    return this._http
      .post(this._baseHref + url, data, {
        headers: {
          accept: 'application/json',
          'content-type': 'multipart/form-data',
          authorization:
            'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYmYiOjE2NzA1NzkyMjYsImV4cCI6MTY3MDU4MjgyNiwiaXNzIjoiaHR0cHM6Ly9hcGkuYXNwb3NlLmNsb3VkIiwiYXVkIjpbImh0dHBzOi8vYXBpLmFzcG9zZS5jbG91ZC9yZXNvdXJjZXMiLCJhcGkuYmlsbGluZyIsImFwaS5pZGVudGl0eSIsImFwaS5wcm9kdWN0cyIsImFwaS5zdG9yYWdlIl0sImNsaWVudF9pZCI6ImZjNzM4MTM5LTUxMDktNDI2MC04MWVmLWRmODIzZTRkYjY3NyIsImNsaWVudF9kZWZhdWx0X3N0b3JhZ2UiOiI4ODU4YWFmYy1hNTMzLTRhMGMtOGMyMy04NWYxYjRhNjA5OWQiLCJjbGllbnRfaWRlbnRpdHlfdXNlcl9pZCI6IjkzMjI3NSIsInNjb3BlIjpbImFwaS5iaWxsaW5nIiwiYXBpLmlkZW50aXR5IiwiYXBpLnByb2R1Y3RzIiwiYXBpLnN0b3JhZ2UiXX0.F2mMIDBUusjGzmtq7bge2Mk_-d8faPXdceBUQdoYFSpuWIeQDb9Xqk2SCOzmAsWt4Etk_Hh-R33QmFXHtwQ4Ge6u9va59pnHZFL9V9mgtZh4nf0sYdz1eXANq_dnspFCjqwW6wWpIf7dnRsb8X7WrPeGbs7unRbXLCfBdcRi1Lm0RiQOBOExQz_CsCNm32U12kCAI4N25ADwop5HLYjJiHfhXNMHL6ugQcR4ew8JcqHc4qf98gCoil4J2Pjp0eMXFwn63RDTUEwmxVUfpYDGdn0T30HjO66xjWONJ-Vwvvo7okyONwzU-HqFLSkSeWYvGwpRbWmGx_JlrzFc1FV1Iw',
        },

        reportProgress: true,
        observe: 'events',
        responseType: 'blob',
      })
      .pipe(
        catchError<any, any>((err: HttpErrorResponse) =>
          console.log('err', err)
        )
      );
  }
}
