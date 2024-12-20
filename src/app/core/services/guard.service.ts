import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})

// To be used by UnsavedChangesGuard
export class GuardService {
  private bypassGuard = false;

  setBypassGuard(value: boolean): void {
    this.bypassGuard = value;
  }

  getBypassGuard(): boolean {
    return this.bypassGuard;
  }
}