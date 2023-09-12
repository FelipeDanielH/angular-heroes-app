import { Injectable, inject } from '@angular/core';
import { Observable, map, tap } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { CanActivateFn, Router, ActivatedRoute, ActivatedRouteSnapshot, RouterStateSnapshot, CanMatchFn, Route, UrlSegment } from '@angular/router';

const checkAuthStatus = (): boolean | Observable<boolean> => {

  const authService: AuthService = inject(AuthService)
  const router: Router = inject(Router)

  return authService.checkAuthentication()
    .pipe(
      tap(isAutheticated => console.log({ 'authenticated': isAutheticated })),
      tap(isAuthenticated => {
        if (isAuthenticated) {
          router.navigate(['./'])
        }
      }),
      map( isAuthenticated => !isAuthenticated )
    )
}

export const canActivatePublicGuard: CanActivateFn = ( // Hay que tener en cuenta el tipado CanActiveFn
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  console.log('CanActivate');
  console.log({ route, state });

  return checkAuthStatus();
};

export const canMatchPublicGuard: CanMatchFn = ( //Tipado CanMatchFN
  route: Route,
  segments: UrlSegment[]
) => {
  console.log('CanMatch');
  console.log({ route, segments });

  return checkAuthStatus();
};

@Injectable({ providedIn: 'root' })
export class PublicGuard {
  constructor() { }

}
