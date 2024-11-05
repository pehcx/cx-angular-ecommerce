import { Component, Input, OnInit } from '@angular/core';
import { IconService } from '../../services/icon.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-icon',
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
      const svg = icon.replace('<svg', `<svg class="${this.class}"`);
      this.svgContent = this.sanitizer.bypassSecurityTrustHtml(svg);
    });
  }
}
