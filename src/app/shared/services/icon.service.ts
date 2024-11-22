import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Cacheable, LocalStorageStrategy } from 'ts-cacheable';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class IconService {
  private iconsUrl = 'assets/icons.json';

  constructor(
    private http: HttpClient,
  ) {}

  // This caches the icon across sessions, reducing data transmit
  @Cacheable({
    cacheKey: "icons",
    storageStrategy: LocalStorageStrategy,
  })
  getIcons(): Observable<{ [key: string]: string }> {
    return this.http.get<{ [key: string]: string }>(this.iconsUrl);
  }

  getIconByKey(key: string): Observable<string> {
    return this.getIcons().pipe(
      map(icons => icons[key])
    );
  }
}