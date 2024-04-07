import {inject, Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot} from "@angular/router";
import {Constants} from "../shared/constants";
import {SessionService} from "kafka-event-structure-lib";
import copy from "fast-copy";

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {

  constructor(private router: Router, private sessionService: SessionService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (!this.sessionService.isTokenExpired()) {
      return true;
    }
    const queryParams: {[key: string]: string} = copy(route.queryParams);
    queryParams[Constants.PATHS.QUERY.EXPIRED] = "";
    this.router.navigate([`/login`],  { queryParams: queryParams});
    return false;
  }
}
export const AuthGuard: CanActivateFn = (next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean => {
  return inject(AuthGuardService).canActivate(next, state);
}
