import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(environment.supabase_url, environment.supabase_key);
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
