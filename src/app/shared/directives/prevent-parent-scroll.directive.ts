import { Directive, ElementRef, Renderer2, HostListener, OnInit } from '@angular/core';

/**
 * Directive to prevent parent scrolling when child content is scrolled.
 * 
 * Use this directive on a scrollable container to contain the scroll behavior 
 * within it and prevent its parent from scrolling.
 */
@Directive({
  selector: '[preventParentScroll]'
})

export class PreventParentScrollDirective implements OnInit {

  private startTouchY: number = 0;
  private isTouching: boolean = false;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit(): void {}

  @HostListener('wheel', ['$event'])
  onWheel(event: WheelEvent): void {
    this.handleScroll(event);
  }

  @HostListener('touchstart', ['$event'])
  onTouchStart(event: TouchEvent): void {
    this.startTouchY = event.touches[0].clientY;
    this.isTouching = true;
  }

  @HostListener('touchmove', ['$event'])
  onTouchMove(event: TouchEvent): void {
    if (!this.isTouching) return;

    const touchMoveY = event.touches[0].clientY;
    const delta = this.startTouchY - touchMoveY;
    this.handleTouchScroll(event, delta);
  }

  @HostListener('touchend', ['$event'])
  onTouchEnd(): void {
    this.isTouching = false;
  }

  private handleScroll(event: WheelEvent): void {
    const element = this.el.nativeElement;
    const scrollTop = element.scrollTop;
    const scrollHeight = element.scrollHeight;
    const height = element.clientHeight;
    const delta = event.deltaY;

    if (delta > 0 && scrollTop + height >= scrollHeight) {
      element.scrollTop = scrollHeight;
      event.preventDefault();
      event.stopPropagation();
    } else if (delta < 0 && scrollTop <= 0) {
      element.scrollTop = 0;
      event.preventDefault();
      event.stopPropagation();
    }
  }

  private handleTouchScroll(event: TouchEvent, delta: number): void {
    const element = this.el.nativeElement;
    const scrollTop = element.scrollTop;
    const scrollHeight = element.scrollHeight;
    const height = element.clientHeight;

    if (delta > 0 && scrollTop + height >= scrollHeight) {
      element.scrollTop = scrollHeight;
      event.preventDefault();
      event.stopPropagation();
    } else if (delta < 0 && scrollTop <= 0) {
      element.scrollTop = 0;
      event.preventDefault();
      event.stopPropagation();
    }
  }
}