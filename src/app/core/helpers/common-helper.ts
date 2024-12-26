import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { environment } from 'src/environments/environment';

export function getImagePath(imageUrl: string) {
  return environment.supabase_url + environment.supabase_storage + imageUrl;
}

export function restrictToNumbers(event: Event): void {
  const input = event.target as HTMLInputElement;
  const value = input.value;
  
  const numericValue = value.replace(/[^0-9]/g, '');
  if (value !== numericValue) {
    input.value = numericValue;
    event.preventDefault();
  }
}

export function expiryDateValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }
    
    const expiryDatePattern = /^(0[1-9]|1[0-2])\/[0-9]{2}$/;

    if (!expiryDatePattern.test(control.value)) {
      return { invalidFormat: true };
    }

    const [month, year] = control.value.split('/').map((value: string) => parseInt(value, 10));

    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear() % 100;

    if (year < currentYear || (year === currentYear && month < currentMonth)) {
      return { expired: true };
    }

    return null;
  };
}