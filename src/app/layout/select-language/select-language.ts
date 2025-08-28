import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-select-language',
  imports: [CommonModule],
  templateUrl: './select-language.html',
  styleUrl: './select-language.scss'
})
export class SelectLanguage {

  private translate = inject(TranslateService);
  langIsAr = true;

  ngOnInit(): void {
    this.translate.addLangs(['en', 'ar']);
    this.translate.use('ar');
    this.setLang(localStorage.getItem('lang') || 'ar');
  }

  setLang(lang: string): void {
    this.translate.use(lang);
    localStorage.setItem('lang', lang);
    this.langIsAr = lang === 'ar';

    document.documentElement.lang = lang;

    const existing = document.getElementById('rtl-style') as HTMLLinkElement;

    if (lang === 'ar') {
        const link = document.createElement('link');
        link.id = 'rtl-style';
        link.rel = 'stylesheet';
        link.href = 'assets/css/styles-ar.scss';
        document.head.appendChild(link);
    } else {
      existing?.remove();
    }
  }


}
