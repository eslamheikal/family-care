import { HttpParams } from "@angular/common/http";
import { EnvironmentHelper } from "./environment-helper";

export class AppUrlGenerator {

    private controller?: string = undefined;
    private ApiURL = `${EnvironmentHelper.API_URL}/api`;

    constructor(controller: string = '') {
        this.controller = this.removeSlashIfExist(controller);
    }

    getEndPoint(resourceName: string, params?: HttpParams) : string{
        const resource = this.removeSlashIfExist(resourceName);
        const baseUrl = `${this.ApiURL}/${this.controller ? `${this.controller}/` : ''}${resource}`;
        
        return params ? `${baseUrl}?${params.toString()}` : baseUrl;
    }

    getFullEndPoint(controller: string, resourceName: string, params?: HttpParams) : string{
        const resource = this.removeSlashIfExist(resourceName);
        const baseUrl = `${this.ApiURL}/${controller ? `${controller}/` : ''}${resource}`;
        
        return params ? `${baseUrl}?${params.toString()}` : baseUrl;
    }

    private removeSlashIfExist(resourceName: string) {
        return resourceName.startsWith('/') ? resourceName.substring(1) : resourceName;
    }
}