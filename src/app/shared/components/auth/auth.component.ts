import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { requiredMsg } from '../../constants';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent {
  public readonly requiredMsg = requiredMsg;
  constructor(
    private _fb: FormBuilder,
    private _dialog: MatDialogRef<AuthComponent>
  ) {}

  public asposeClientFormGroup: FormGroup = this._fb.group({
    // clientId: [null, [Validators.required]],
    // clientSecret: [null, [Validators.required]],
    clientId: ['fc738139-5109-4260-81ef-df823e4db677', [Validators.required]],
    clientSecret: ['505071c48c9143a95aced04771bce5fd', [Validators.required]],
  });

  public submit() {
    if (this.asposeClientFormGroup.invalid) {
      return;
    }
    this._dialog.close(this.asposeClientFormGroup.value);
  }
}
