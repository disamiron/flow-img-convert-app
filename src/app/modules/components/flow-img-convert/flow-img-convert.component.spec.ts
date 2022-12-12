import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { FlowImgConvertComponent } from './flow-img-convert.component';

describe('FlowImgConvertComponent', () => {
  let component: FlowImgConvertComponent;
  let fixture: ComponentFixture<FlowImgConvertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FlowImgConvertComponent],
      imports: [
        HttpClientTestingModule,
        MatSnackBarModule,
        MatDialogModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        MatSelectModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FlowImgConvertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
