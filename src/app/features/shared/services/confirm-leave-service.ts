import { Injectable } from "@angular/core";
import { ConfirmService } from "./confirm.serivce";

@Injectable({
    providedIn: 'root'
})
export class ConfirmLeaveService {
    private readonly defaultMessage = 'هل أنت متأكد من أنك تريد الخروج دون حفظ التغييرات؟';

    constructor(private confirmService: ConfirmService) { }
    
    confirm(
        confirmCallback: () => void, 
        cancelCallback: () => void = () => {},
        customMessage?: string
    ): void {
        this.confirmService.confirm(
            customMessage || this.defaultMessage,
            () => confirmCallback(),
            () => cancelCallback()
        );
    }
    
}

