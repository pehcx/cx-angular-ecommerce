import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { IconService } from 'src/app/shared/services/icon.service';

@Component({
  selector: 'icon',
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.scss']
})

export class IconComponent implements OnInit {
  @Input() key: string = '';
  @Input() class: string = '';

  svgContent: SafeHtml | null = null;

  constructor(
    private iconService: IconService,
    private sanitizer: DomSanitizer,
  ) {}

  ngOnInit(): void {
    this.iconService.getIconByKey(this.key).subscribe(icon => {
      const svg = icon ? icon.replace('<svg', `<svg class="${this.class}"`): "";
      this.svgContent = this.sanitizer.bypassSecurityTrustHtml(svg);
    });
  }
}
