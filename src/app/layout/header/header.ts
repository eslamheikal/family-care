import { Component } from '@angular/core';
import { SelectLanguage } from '../select-language/select-language';
import { Notification } from "../notification/notification";

@Component({
  selector: 'app-header',
  imports: [SelectLanguage, Notification],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header {

}
