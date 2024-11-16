import { Component } from '@angular/core';
import { initFlowbite } from 'flowbite';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = environment.title;
  
  ngOnInit() {
    initFlowbite();
  }
}