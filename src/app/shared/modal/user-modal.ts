import {Component} from "@angular/core";

@Component({
  selector: 'user-modal',

  template: `
    <div mat-dialog-content>Данные были отправлены</div>
    <div mat-dialog-actions>
      <button mat-button mat-dialog-close>Close</button>
    </div>
  `
})
export class UserModal {
  constructor() {
  }
}
