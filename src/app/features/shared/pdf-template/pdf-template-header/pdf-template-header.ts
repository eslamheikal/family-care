import { Component, Input } from '@angular/core';

@Component({
  selector: 'pdf-template-header',
  imports: [],
  templateUrl: './pdf-template-header.html',
  styleUrl: './pdf-template-header.scss'
})
export class PdfTemplateHeader {

  @Input() title: string = '';
}
