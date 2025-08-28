import { HttpErrorResponse, HttpHandlerFn, HttpRequest } from "@angular/common/http";
import { inject } from "@angular/core";
import { Observable, of, throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { ToastService } from "../../features/shared/services/toast.service";
import { LoaderService } from "../../features/shared/services/loader.service";
import { TranslateService } from "@ngx-translate/core";
import { ErrorNavigationService } from "../../features/error-pages";

export function resultErrorInterceptor(request: HttpRequest<any>, next: HttpHandlerFn): Observable<any> {

    const toastService = inject(ToastService);
    const loader = inject(LoaderService);
    const translate = inject(TranslateService);
    const errorNavigationService = inject(ErrorNavigationService);

    return next(request).pipe(
        catchError((error: HttpErrorResponse) => {
            loader.hide();

            if (error.status === 401 || error.status === 403) {
                errorNavigationService.navigateToAccessDenied();
                return of(null);
            }

            if (error.status === 404) {
                errorNavigationService.navigateToNotFound();
                return of(null);
            }

            if (error.status === 502) {
                errorNavigationService.navigateToServerError();
                return of(null);
            }

            if (error.status === 503) {
                errorNavigationService.navigateToServiceUnavailable();
                return of(null);
            }

            if (error.status === 504) {
                errorNavigationService.navigateToGatewayTimeout();
                return of(null);
            }

            const errorMessage = extractErrorMessage(error, translate);

            if (errorMessage) {
                toastService.showError(errorMessage);
            }

            return throwError(() => formatError(error, translate));
        })
    );
}

function extractErrorMessage(error: HttpErrorResponse, translate: TranslateService): string {

    // Client-side or network error
    if (error.error instanceof ErrorEvent) {
        return `Client error: ${error.error}`;
    }

    // Server-side errors
    switch (error.status) {
        case 0:
            return 'Failed to connect to the API server. Please check your network connection.';
        case 400:
            return getValidationErrors(error) || 'Invalid request. Please check your input.';
        case 500:
            return getServerErrorMessage(error) || 'Internal server error. Please try again later.';
        case 502:
            return 'Bad gateway. The server is temporarily unavailable.';
        case 503:
            return 'Service unavailable. The server is temporarily down for maintenance.';
        case 504:
            return 'Gateway timeout. The server took too long to respond.';
        default:
            return getServerErrorMessage(error) || 'An unexpected error occurred.';
    }
}

function getValidationErrors(error: HttpErrorResponse): string | null {

    // Check for ValidationErrors array in the response
    if (error.error?.value?.ValidationErrors?.length > 0) {
        return error.error.value.ValidationErrors
            .map((err: any) => `${err.propertyName}: ${err.errorMessage}`)
            .join('\n');
    }
    
    // Fallback to error.detail if ValidationErrors is empty
    if (error.error?.value?.detail) {
        return error.error.value.detail;
    }
    
    // Fallback to simple error message
    if (error.error?.error) {
        return error.error.error;
    }
    
    return null;
}

function getServerErrorMessage(error: HttpErrorResponse): string | null {

    // Try different possible error message locations
    if (error.error?.message) {
        return error.error.message;
    }
    
    if (error.error?.error) {
        return error.error.error;
    }
    
    if (error.error?.detail) {
        return error.error.detail;
    }
    
    if (error.error?.title) {
        return error.error.title;
    }
    
    if (error.message) {
        return error.message;
    }
    
    // If error.error is a string, use it directly
    if (typeof error.error === 'string') {
        return error.error;
    }
    
    return null;
}

function formatError(error: HttpErrorResponse, translate: TranslateService): any {
    return {
        status: error.status,
        message: extractErrorMessage(error, translate),
        originalError: error.error,
        validationErrors: error.error?.errors
    };
}