import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ScrollPanelModule } from 'primeng/scrollpanel';

@Component({
  selector: 'app-sidenav',
  imports: [CommonModule, ScrollPanelModule],
  templateUrl: './sidenav.html',
  styleUrl: './sidenav.scss'
})
export class Sidenav {
}
