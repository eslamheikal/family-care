import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

export interface PersonalTab {
  label: string;
  icon: string;
  onClick?: () => void;
}

@Component({
  selector: 'personal-tabs',
  imports: [CommonModule, TranslateModule],
  templateUrl: './personal-tabs.html',
  styleUrl: './personal-tabs.scss'
})
export class PersonalTabs {

  @Input() tabs: PersonalTab[] = [];

  @Output() activeTabChange = new EventEmitter<string>();

  activeTab = '';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['tabs']) {
      this.activeTab = this.tabs[0].label;
    }
  }

  setActiveTab = (label: string) => {
    this.activeTab = label;
    this.tabs.find(tab => tab.label === label)?.onClick?.();
    this.activeTabChange.emit(label);
  }
}
