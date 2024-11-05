import { Component } from '@angular/core';
import { createClient } from '@supabase/supabase-js'
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'CX Angular Ecommerce';
  supabase:any;

  ngOnInit() {
    this.supabase = createClient(environment.supabase_url, environment.supabase_key);
    // this.fetchData();
  }

  async fetchData() {
    const { data, error } = await this.supabase
        .from('products')
        .select('*')
        .order('id');

    if (error) {
        console.error('Error fetching data:', error)
        return;
    }

    console.log('Data:', data)
  }

  
}