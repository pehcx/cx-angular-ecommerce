import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[expiryDateFormatter]'
})

export class ExpiryDateFormatterDirective {
  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event']) onInput(event: KeyboardEvent): void {
    const input = this.el.nativeElement;

    let formatted = input.value.replace(/[^0-9/]/g, '');

    if (formatted.length > 5) {
      formatted = formatted.slice(0, 5);
    }

    if (formatted.length > 2 && !formatted.includes('/')) {
      formatted = `${formatted.slice(0, 2)}/${formatted.slice(2)}`;
    }

    input.value = formatted;
  }
}