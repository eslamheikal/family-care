import { Component, EventEmitter, forwardRef, Input, Output } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'delete-confirmation',
  imports: [TranslateModule],
  templateUrl: './delete-confirmation.html',
  styleUrl: './delete-confirmation.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DeleteConfirmation),
      multi: true
    }
  ]
})
export class DeleteConfirmation {
  @Input() message: string = 'shared.dialogs.deleteConfirmation';
  @Output() confirm: EventEmitter<void> = new EventEmitter();
  @Output() cancel: EventEmitter<void> = new EventEmitter();

  onConfirm = () => this.confirm.emit();
  onCancel = () => this.cancel.emit();
}
