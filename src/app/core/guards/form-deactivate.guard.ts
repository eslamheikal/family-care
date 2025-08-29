import { CanDeactivateFn } from "@angular/router";
import { inject } from "@angular/core";
import { ConfirmService } from "../../features/shared/services/confirm.serivce";

export interface CanDeactivateComponent {
  get dirty(): boolean;
}

export const canDeactivateForm: CanDeactivateFn<CanDeactivateComponent> = (component) => {
  const confirmService = inject(ConfirmService);

  if (!component.dirty) {
    return true;
  }

  return new Promise<boolean>(resolve => {
    confirmService.confirmLeave(
      () => resolve(true)
    );
  });
};