import { Directive, ElementRef, HostListener } from '@angular/core';

/**
 * Directive to format credit card numbers dynamically.
 * 
 * Formats the input by removing non-numeric characters and adding spaces 
 * every 4 digits for better readability.
 */
@Directive({
  selector: '[cardNumberFormatter]',
})

export class CardNumberFormatterDirective {
  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event']) onInput(event: KeyboardEvent): void {
    const input = this.el.nativeElement;
    let formatted = input.value.replace(/[^0-9]/g, '');
    formatted = formatted.replace(/(.{4})/g, '$1 ').trim();
    input.value = formatted;
  }
}