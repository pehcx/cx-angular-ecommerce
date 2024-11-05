import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Cacheable } from 'ts-cacheable';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IconService {
  private iconsUrl = 'assets/icons.json';

  constructor(private http: HttpClient) {}

  @Cacheable()
  getIcons(): Observable<{ [key: string]: string }> {
    return this.http.get<{ [key: string]: string }>(this.iconsUrl);
  }

  getIconByKey(key: string): Observable<string> {
    return this.getIcons().pipe(
      map(icons => icons[key])
    );
  }
}
