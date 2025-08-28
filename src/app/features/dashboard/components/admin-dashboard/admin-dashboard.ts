import { Component, inject } from '@angular/core';
import { PdfExportService } from '../../../shared/services/pdf-export.service';

@Component({
  selector: 'app-admin-dashboard',
  imports: [],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.scss'
})
export class AdminDashboard {

  private pdfExportService = inject(PdfExportService);

  exportAttendance() {
    const data = [
      { name: 'محمد أحمد', status: 'حاضر', notes: 'جيد' },
      { name: 'علي حسن', status: 'غائب', notes: '' },
      { name: 'سارة علي', status: 'متأخر', notes: '10 دقائق' },
      { name: 'محمد أحمد', status: 'حاضر', notes: 'جيد' },
      { name: 'علي حسن', status: 'غائب', notes: '' },
      { name: 'سارة علي', status: 'متأخر', notes: '10 دقائق' },
      { name: 'محمد أحمد', status: 'حاضر', notes: 'جيد' },
      { name: 'علي حسن', status: 'غائب', notes: '' },
      { name: 'سارة علي', status: 'متأخر', notes: '10 دقائق' },
      { name: 'محمد أحمد', status: 'حاضر', notes: 'جيد' },
    ];
    // this.pdfExportService.exportAttendance(data);
  }
}
