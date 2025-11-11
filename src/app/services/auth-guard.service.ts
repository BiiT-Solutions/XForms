import {inject, Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot} from "@angular/router";
import {Constants} from "../shared/constants";
import {AuthService, SessionService} from "@biit-solutions/kafka-event-structure";
import copy from "fast-copy";
import {BiitSnackbarService, NotificationType} from "@biit-solutions/wizardry-theme/info";
import {TranslocoService} from "@ngneat/transloco";
import {AuthService as UserManagerAuthService} from "@biit-solutions/user-manager-structure";
import {SessionService as UserManagerSessionService} from "@biit-solutions/user-manager-structure";
import {User} from "@biit-solutions/authorization-services";
import {firstValueFrom, forkJoin, Observable} from "rxjs";
import {HttpResponse} from "@angular/common/http";


@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {

  constructor(private router: Router,
              private translocoService: TranslocoService,
              private biitSnackbarService: BiitSnackbarService,
              private sessionServiceUserManager: UserManagerSessionService,
              private userManagerLoginService: UserManagerAuthService,
              private authService: AuthService,
              private sessionService: SessionService) { }

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    const queryParams: {[key: string]: string} = copy(route.queryParams);

    if (!this.sessionService.isTokenExpired()) {
      // We indicate token has expired
      queryParams[Constants.PATHS.QUERY.EXPIRED] = "";
      return true;
    }

    if (route.queryParams[Constants.PATHS.QUERY.TEMPORAL_TOKEN] !== undefined) {
      try {
        await this.login(route.queryParams[Constants.PATHS.QUERY.TEMPORAL_TOKEN]);
        return true;
      } catch (error) {
        console.error('Error logging in');
        queryParams[Constants.PATHS.QUERY.TOKEN_NOT_VALID] = "";
      }
    }

    this.router.navigate([`/login`],  { queryParams: queryParams});
    return false;
  }

  private canAccess(user: User): boolean {
    return user.applicationRoles && user.applicationRoles.some(value => value.startsWith(Constants.APP.APP_PERMISSION_NAME));
  }

  private async login(token: string): Promise<void> {
    return  new Promise<void>(async (resolve, reject) => {
      const userManagerLogin: Observable<HttpResponse<User>> = this.userManagerLoginService.loginByToken(token);
      const authLogin: Observable<HttpResponse<User>> = this.authService.loginByToken(token);
      let responses: HttpResponse<User>[] = [];
      try {
        responses = await firstValueFrom(forkJoin([userManagerLogin, authLogin]));
      }catch (error) {
        console.error(error);
        reject();
        return;
      }

      for (const [index, response] of responses.entries()) {
        const user: User = User.clone(response.body);
        if (!this.canAccess(user)) {
          const msg = await firstValueFrom(this.translocoService.selectTranslate('access_denied_permissions'));
          this.biitSnackbarService.showNotification(msg, NotificationType.ERROR, null, 10);
          reject();
          return;
        }
        const token: string = response.headers.get(Constants.HEADERS.AUTHORIZATION_RESPONSE);
        const expiration: number = +response.headers.get(Constants.HEADERS.EXPIRES);
        switch (index) {
          case 0:
            this.sessionServiceUserManager.setToken(token, expiration, true, true);
            this.sessionServiceUserManager.setUser(user);
            break;
          case 1:
            this.sessionService.setToken(token, expiration, true, true);
            this.sessionService.setUser(user);
            break;
        }
      }
      resolve();
    });
  }
}

export const AuthGuard: CanActivateFn = async (next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> => {
  return await inject(AuthGuardService).canActivate(next, state);
}
