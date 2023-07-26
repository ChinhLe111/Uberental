import { AfterViewInit, Directive, ElementRef, EventEmitter, Input, Output } from '@angular/core';
import Swiper, { SwiperOptions } from 'swiper';

@Directive({
  selector: '[fmSwiper]',
})
export class SwiperDirective implements AfterViewInit {
  private readonly swiperElement;

  @Input('config') config?: SwiperOptions;
  @Output() init = new EventEmitter<HTMLElement & { swiper?: Swiper } & { initialize: () => void }>();
  constructor(private el: ElementRef<HTMLElement & { swiper?: Swiper } & { initialize: () => void }>) {
    this.swiperElement = el.nativeElement;
  }

  ngAfterViewInit() {
    Object.assign(this.el.nativeElement, this.config);
    this.el.nativeElement.initialize();
    this.init.emit(this.swiperElement);
  }
}
