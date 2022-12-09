import { Injectable } from '@angular/core';
import { Token } from '../../interfaces';
import { BaseHttpService } from '../base-http/base-http.service';

@Injectable({
  providedIn: 'root',
})
export class AsposeService {
  private readonly _tokenHref = '/connect/token';
  private readonly _convertHref = '/imaging/convert';

  constructor(private _http: BaseHttpService) {}

  public getToken(clientId: string, clientSecret: string) {
    let params = new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: clientId,
      client_secret: clientSecret,
    });
    return this._http.postData<Token>(this._tokenHref, params);
  }

  public convertImg(data: File, format: string) {
    return this._http.postBlobWithProgress<Blob>(
      this._convertHref,
      { format },
      data
    );
  }
}
