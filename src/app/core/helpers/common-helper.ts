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