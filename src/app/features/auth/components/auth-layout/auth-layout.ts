import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { SelectLanguage } from '../../../../layout/select-language/select-language';

@Component({
  selector: 'app-auth-layout',
  imports: [RouterOutlet, TranslateModule, SelectLanguage],
  templateUrl: './auth-layout.html',
  styleUrl: './auth-layout.scss'
})
export class AuthLayout {

}
