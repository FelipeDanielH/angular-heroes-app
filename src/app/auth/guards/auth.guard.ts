import { inject, Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  CanMatchFn,
  Route,
  Router,
  RouterStateSnapshot,
  UrlSegment
} from '@angular/router';
import { Observable, tap } from 'rxjs';
import { AuthService } from '../services/auth.service';

const checkAuthStatus = (): boolean | Observable<boolean> => {

  const authService: AuthService = inject(AuthService)
  const router: Router = inject(Router)

  return authService.checkAuthentication()
    .pipe(
      tap(isAutheticated => console.log({ 'authenticated': isAutheticated })),
      tap(isAuthenticated => {
        if (!isAuthenticated) {
          router.navigate(['./auth/login'])
        }
      })
    )
}

export const canActivateGuard: CanActivateFn = ( // Hay que tener en cuenta el tipado CanActiveFn
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  console.log('CanActivate');
  console.log({ route, state });

  return checkAuthStatus();
};

export const canMatchGuard: CanMatchFn = ( //Tipado CanMatchFN
  route: Route,
  segments: UrlSegment[]
) => {
  console.log('CanMatch');
  console.log({ route, segments });

  return checkAuthStatus();
};

@Injectable({ providedIn: 'root' })
export class AuthGuard {

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

}
