import { Injectable } from '@angular/core';
import { BaseHttpService } from '../base-http/base-http.service';

@Injectable({
  providedIn: 'root',
})
export class AsposeService {
  // private readonly _tokenHref =
  //   '/connect/token&grant_type=client_credentials&client_id=fc738139-5109-4260-81ef-df823e4db677&client_secret=505071c48c9143a95aced04771bce5fd';
  private readonly _tokenHref = '/connect/token';
  private readonly _baseHref = '/imaging/convert?format=png';
  constructor(private _http: BaseHttpService) {}

  public getToken() {
    return this._http.postData<any>(this._tokenHref);
  }

  public convertImg(data: File) {
    return this._http.postBlobWithProgress<Blob>(this._baseHref, data);
  }
}
