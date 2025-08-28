import { HttpHandlerFn, HttpRequest, HttpResponse } from "@angular/common/http";
import { inject } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { ResultModel } from "../models/result.model";
import { ToastService } from "../../features/shared/services/toast.service";
import { LoaderService } from "../../features/shared/services/loader.service";

export function resultModelInterceptor(request: HttpRequest<any>, next: HttpHandlerFn): Observable<any> {
  const toastService = inject(ToastService);
  const loader = inject(LoaderService);
  
  return next(request).pipe(
    map(event => {
      if (event instanceof HttpResponse) {
        const body = event.body as any;

        // Check if it's a ResultModel
        if (body && body.isSuccess !== undefined) {
          if (body.isSuccess) {
            
            // Return only the data if successful
            return new HttpResponse({
              ...event,
              url: event.url ?? undefined,
              body: body.value
            });
          } else {
            // Throw an error if not successful
            if(body && body.errors && body.errors.length > 0){
              const result = body as ResultModel<any>;
              const errors = result.errors?.join(',') ?? 'An error occurred';
              toastService.showError(errors); 
              loader.hide();
              console.error(body); 
            } else {
              toastService.showError(body.error);
              loader.hide();
            }
           
            // Return only the data if successful
            return new HttpResponse({
              ...event,
              url: event.url ?? undefined,
              body: false
            });
          }
        }
      }
      return event;
    })
  );
}