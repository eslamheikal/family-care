import { inject, Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AppTitleService } from '../services/title.service';

@Injectable({
  providedIn: 'root'
})
export class TitleResolver implements Resolve<void> {
  private titleService = inject(AppTitleService);

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<void> {
    const title = route.data['title'];
    const subtitle = route.data['subtitle'];

    if (title) {
      this.titleService.setCustomTitle(title);
    } else if (subtitle) {
      this.titleService.setTitle(subtitle, route.data['translateTitle'] !== false);
    } else {
      this.titleService.resetTitle();
    }
    
    return of(void 0);
  }
}
