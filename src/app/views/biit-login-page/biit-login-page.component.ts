import {Component, OnInit} from '@angular/core';
import {BiitLogin} from "biit-ui/models";
import {Constants} from "../../shared/constants";
import {HttpResponse} from "@angular/common/http";
import {BiitProgressBarType, BiitSnackbarService, NotificationType} from "biit-ui/info";
import {TRANSLOCO_SCOPE, TranslocoService} from "@ngneat/transloco";
import {BiitIconService} from "biit-ui/icon";
import {completeIconSet} from "biit-icons-collection";
import {ActivatedRoute, Router} from "@angular/router";
import {LoginRequest, User} from "authorization-services-lib";
import {AuthService, SessionService} from "kafka-event-structure-lib";
import {UserService} from "user-manager-structure-lib";
import {ErrorHandler} from 'biit-ui/utils';
import {Environment} from "../../../environments/environment";

@Component({
  selector: 'biit-login-page',
  templateUrl: './biit-login-page.component.html',
  styleUrls: ['./biit-login-page.component.scss'],
  providers: [
    {
      provide: TRANSLOCO_SCOPE,
      multi:true,
      useValue: {scope: 'login', alias: 'errors'}
    }
  ]
})
export class BiitLoginPageComponent implements OnInit {

  protected readonly BiitProgressBarType = BiitProgressBarType;
  protected waiting: boolean = true;
  constructor(private authService: AuthService,
              private sessionService: SessionService,
              private userService: UserService,
              private biitSnackbarService: BiitSnackbarService,
              biitIconService: BiitIconService,
              private activateRoute: ActivatedRoute,
              private router: Router,
              private translocoService: TranslocoService) {
    biitIconService.registerIcons(completeIconSet);
  }

  ngOnInit(): void {
    this.managePathQueries();
    if (!this.sessionService.isTokenExpired()) {
      this.router.navigate([Constants.PATHS.FORM_VIEW]);
    } else {
      this.waiting = false;
    }
  }

  login(login: BiitLogin): void {
    this.waiting = true;
    this.authService.login(new LoginRequest(login.username, login.password)).subscribe({
      next: (response: HttpResponse<User>) => {
        const user: User = User.clone(response.body);
        if (!this.canAccess(user)) {
          this.waiting = false;
          this.translocoService.selectTranslate('access_denied_permissions').subscribe(msg => {
            this.biitSnackbarService.showNotification(msg, NotificationType.ERROR, null, 10);
          });
          return;
        }
        const token: string = response.headers.get(Constants.HEADERS.AUTHORIZATION_RESPONSE);
        const expiration: number = +response.headers.get(Constants.HEADERS.EXPIRES);
        this.sessionService.setToken(token, expiration, login.remember, true);
        this.sessionService.setUser(user);
        this.router.navigate([Constants.PATHS.FORM_VIEW],
          {queryParams: this.activateRoute.snapshot.queryParams});
      },
      error: error => ErrorHandler.notify(error, this.translocoService, this.biitSnackbarService)
    }).add(() => this.waiting = false);
  }

  private canAccess(user: User): boolean {
    return user.applicationRoles && user.applicationRoles
      .some((value: string) => value.startsWith(Constants.APP.APP_PERMISSION_NAME));
  }


  private managePathQueries(): void {
    this.activateRoute.queryParams.subscribe(params => {
      const queryParams: {[key: string]: string} = {};
      if (params[Constants.PATHS.QUERY.EXPIRED] !== undefined) {
        this.translocoService.selectTranslate(Constants.PATHS.QUERY.EXPIRED, {},  {scope: 'login'}).subscribe(msg => {
          this.biitSnackbarService.showNotification(msg, NotificationType.INFO, null, 5);
        });
        queryParams[Constants.PATHS.QUERY.EXPIRED] = null;
      }
      if (params[Constants.PATHS.QUERY.LOGOUT] !== undefined) {
        this.sessionService.clearToken();
        this.translocoService.selectTranslate(Constants.PATHS.QUERY.LOGOUT, {},  {scope: 'login'}).subscribe(msg => {
          this.biitSnackbarService.showNotification(msg, NotificationType.SUCCESS, null, 5);
        });
        queryParams[Constants.PATHS.QUERY.LOGOUT] = null;
      }
      this.router.navigate([], {queryParams: queryParams, queryParamsHandling: 'merge'});
    });
  }

  protected onResetPassword(email: string) {
    this.userService.resetPassword(email).subscribe({
      next: () => {
        this.translocoService.selectTranslate('success', {},  {scope: 'biit-ui/login'}).subscribe(msg => {
          this.biitSnackbarService.showNotification(msg, NotificationType.SUCCESS, null, 5);
        });
      },
      error: error => ErrorHandler.notify(error, this.translocoService, this.biitSnackbarService)
    })
  }

  onSignUp(data: {name: string, lastname: string, email: string, password: string}) {
    const user = new User();
    user.name = data.name;
    user.lastname = data.lastname;
    user.email = data.email;
    user.password = data.password;
    this.userService.createPublic(user.name, user.lastname, `${user.name[0]}${user.lastname}${Math.trunc(Math.random() * 1000)}`, user.email, user.password).subscribe({
      next: response => {
        const login = new BiitLogin(response.username, user.password)
        this.login(login);
      },
      error: err => ErrorHandler.notify(err, this.translocoService, this.biitSnackbarService)
    });
  }

  protected readonly Environment = Environment;
}
