import { Injectable, inject } from '@angular/core';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class PdfExportService {
  private translateService: TranslateService = inject(TranslateService);


  async exportToPdf(
    element: HTMLElement, 
    filename: string = 'export.pdf',
    options: {
      orientation?: 'portrait' | 'landscape';
      format?: 'a4' | 'a3' | 'letter';
      margin?: number;
      scale?: number;
    } = {}
  ): Promise<void> {
    try {
      const {
        orientation = 'portrait',
        format = 'a4',
        margin = 10,
        scale = 3
      } = options;

      // Convert element to canvas
      const canvas = await html2canvas(element, {
        scale,
        useCORS: true,
        backgroundColor: '#ffffff'
      });

      // Init PDF
      const pdf = new jsPDF(orientation, 'mm', format);
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      const imgWidth = pageWidth - margin * 2;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      const imgData = canvas.toDataURL('image/png');

      let heightLeft = imgHeight;
      let position = margin;

      // First page
      pdf.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Add more pages if needed
      while (heightLeft > 0) {
        pdf.addPage();
        position = heightLeft - imgHeight + margin;
        pdf.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Optional: Add footer (page number or translation text)
      // Example:
      // pdf.setFontSize(10);
      // pdf.text(`${this.translateService.instant('REPORT.GENERATED_ON')}: ${new Date().toLocaleString()}`,
      //   margin, pageHeight - 5);

      // Save
      pdf.save(filename);
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw error;
    }
  }

  
  
}
