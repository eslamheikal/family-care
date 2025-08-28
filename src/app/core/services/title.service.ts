import { inject, Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class AppTitleService {
  
  private translateService: TranslateService = inject(TranslateService);
  private titleService: Title = inject(Title);
  
  private baseTitle = this.translateService.instant('appName');

  setTitle(subtitle?: string, useTranslation: boolean = true): void {
    if (!subtitle) {
      this.titleService.setTitle(this.translateService.instant(this.baseTitle));
      return;
    }

    if (useTranslation) {
      this.translateService.get(subtitle).subscribe((translatedSubtitle: string) => {
        const fullTitle = `${this.baseTitle} - ${translatedSubtitle}`;
        this.titleService.setTitle(fullTitle);
      });
    } else {
      const fullTitle = `${subtitle} - ${this.baseTitle}`;
      this.titleService.setTitle(fullTitle);
    }
  }


  setCustomTitle(title: string): void {
    this.titleService.setTitle(title);
  }

  /**
   * Reset to the base title
   */
  resetTitle(): void {
    this.titleService.setTitle(this.baseTitle);
  }

  /**
   * Get the current title
   */
  getTitle(): string {
    return this.titleService.getTitle();
  }
}
