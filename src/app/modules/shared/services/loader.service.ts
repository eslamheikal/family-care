import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Injectable({
    providedIn: 'root',
})
export class LoaderService {
    private renderer: Renderer2;

    constructor(
        private ngxLoader: NgxUiLoaderService,
        private rendererFactory: RendererFactory2
    ) {
        this.renderer = this.rendererFactory.createRenderer(null, null);
    }

    show(state?: string, blankBackground?: boolean | null): void {
        const loaderElement = document.querySelector('.ngx-overlay');
        if (loaderElement) {
            if (blankBackground) {
                this.renderer.setStyle(loaderElement, 'background-color', 'white');
            } else {
                this.renderer.setStyle(loaderElement, 'background-color', 'rgba(82, 82, 82, 0.2)');
            }
            this.renderer.setStyle(document.querySelector('.ngx-progress-bar'), 'display', 'none');
        }
        this.ngxLoader.start(state);
    }

    hide(state?: string): void {
        this.ngxLoader.stop(state);
    }
}
