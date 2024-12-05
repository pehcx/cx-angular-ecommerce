import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class ProductIdGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot) {
    const id = route.paramMap.get('id');
    const isNumber = id && /^[0-9]+$/.test(id);

    if (isNumber) {
      return true;
    } else {
      this.router.navigate(['/products']);
      return false;
    }
  }
}