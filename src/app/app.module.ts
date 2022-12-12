import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';

import { NgxDropzoneModule } from 'ngx-dropzone';
import { SharedModule } from './shared/shared.module';
import { FlowImgConvertComponent } from './modules/components/flow-img-convert/flow-img-convert.component';

@NgModule({
  declarations: [AppComponent, FlowImgConvertComponent],
  imports: [BrowserModule, NgxDropzoneModule, SharedModule],
  providers: [SharedModule],
  bootstrap: [AppComponent],
})
export class AppModule {}
