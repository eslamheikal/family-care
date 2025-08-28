import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'form-error',
  imports: [CommonModule],
  templateUrl: './form-error.html',
  styleUrl: './form-error.scss'
})
export class FormError {

  @Input() isValid: boolean = false;
  @Input() message: string = '';
}
