import { CanDeactivateFn } from "@angular/router";
import { ConfirmLeaveService } from "../../features/shared/services/confirm-leave-service";
import { inject } from "@angular/core";

export interface CanDeactivateComponent {
  get dirty(): boolean;
}

export const canDeactivateForm: CanDeactivateFn<CanDeactivateComponent> = (component) => {
  const confirmLeaveService = inject(ConfirmLeaveService);

  if (!component.dirty) {
    return true;
  }

  return new Promise<boolean>(resolve => {
    confirmLeaveService.confirm(
      () => resolve(true),
      () => resolve(false)
    );
  });
};