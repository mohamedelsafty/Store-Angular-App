import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { UserRole } from '@core/enums/userRole.enum';
import { AuthenticationService } from '@core/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class RoleGuard implements CanActivate {
  constructor(
    private router: Router,
    private authService: AuthenticationService
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/']);
      return false;
    }

    const userRole = this.authService.getUser()?.role;
    if (this.isRoleMismatch(next.data['role'], userRole as UserRole)) {
      if (userRole) {
        this.redirectUser(userRole as UserRole);
      }
      return false;
    }

    return true;
  }

  private isRoleMismatch(
    expectedRole: UserRole,
    actualRole: UserRole
  ): boolean {
    return expectedRole && expectedRole !== actualRole;
  }

  private redirectUser(role: UserRole): void {
    if (role === UserRole.Admin) {
      this.router.navigate(['/admin-view']);
    } else {
      this.router.navigate(['/user-view']);
    }
  }
}
