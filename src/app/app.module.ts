import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { AsposeService } from './shared/services/aspose/aspose.service';
import { BaseHttpService } from './shared/services/base-http/base-http.service';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { SharedModule } from './shared/shared.module';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, HttpClientModule, NgxDropzoneModule, SharedModule],
  providers: [BaseHttpService, AsposeService],
  bootstrap: [AppComponent],
})
export class AppModule {}
