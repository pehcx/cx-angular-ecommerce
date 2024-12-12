import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { SupabaseService } from '../services/supabase.service';

@Injectable({
  providedIn: 'root',
})

export class AuthGuard implements CanActivate {
  constructor(private supabaseService: SupabaseService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const user = this.supabaseService.getSession()?.user;
    if (user) {
      return true;
    } else {
      this.router.navigate(['/']);
      return false;
    }
  }
}