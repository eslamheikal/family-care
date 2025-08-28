import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CardModule } from 'primeng/card';
import { AddBtn } from "../../buttons/add-btn/add-btn";

@Component({
  selector: 'card-container',
  standalone: true,
  imports: [CardModule, CommonModule, AddBtn],
  templateUrl: './card-container.html',
  styleUrl: './card-container.scss'
})
export class CardContainer {

  @Input() title: string = '';
  @Input() addBtn: boolean = false;

  @Output() onAdd: EventEmitter<void> = new EventEmitter<void>();
  onAddClick = () => this.onAdd.emit();
}
