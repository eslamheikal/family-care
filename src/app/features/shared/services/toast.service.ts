import { inject, Injectable } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { MessageService } from "primeng/api";

@Injectable({
    providedIn: 'root'
})
export class ToastService {

    private translate = inject(TranslateService);
    private messageService = inject(MessageService);

    showSuccess(message: string) {
        this.messageService.add({ severity: 'success', summary: this.translate.instant('toast.success'), detail: message });
    }

    showInfo(message: string) {
        this.messageService.add({ severity: 'info', summary: this.translate.instant('toast.info'), detail: message });
    }

    showWarn(message: string) {
        this.messageService.add({ severity: 'warn', summary: this.translate.instant('toast.warning'), detail: message });
    }

    showError(message: string) {
        this.messageService.add({ severity: 'error', summary: this.translate.instant('toast.error'), detail: message });
    }

    showGeneralErr() {
        this.showError(this.translate.instant('toast.generalError'));
    }
}