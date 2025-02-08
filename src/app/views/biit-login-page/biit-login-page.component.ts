import {Component, OnInit} from '@angular/core';
import {BiitLogin} from "biit-ui/models";
import {Constants} from "../../shared/constants";
import {HttpResponse} from "@angular/common/http";
import {BiitProgressBarType, BiitSnackbarService, NotificationType} from "biit-ui/info";
import {TRANSLOCO_SCOPE, TranslocoService} from "@ngneat/transloco";
import {BiitIconService} from "biit-ui/icon";
import {completeIconSet} from "biit-icons-collection";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {LoginRequest, User} from "authorization-services-lib";
import {AuthService, SessionService} from "kafka-event-structure-lib";
import {BiitLoginServiceSupport} from "biit-ui/login/biit-login/models/biit-login-service-support";
import {
  AuthService as UserManagerAuthService,
  SessionService as UserManagerSessionService,
  SignupRequestConverter,
  TeamService,
  UserService
} from "user-manager-structure-lib";
import {ErrorHandler} from 'biit-ui/utils';
import {Environment} from "../../../environments/environment";
import {combineLatest, firstValueFrom} from "rxjs";
import {ItemMap} from "../../model/item-map";
import {SignUpRequest} from "biit-ui/login/biit-login/models/sign-up-request";

@Component({
  selector: 'biit-login-page',
  templateUrl: './biit-login-page.component.html',
  styleUrls: ['./biit-login-page.component.scss'],
  providers: [
    {
      provide: TRANSLOCO_SCOPE,
      multi: true,
      useValue: {scope: 'login', alias: 'errors'}
    }
  ]
})
export class BiitLoginPageComponent implements OnInit, BiitLoginServiceSupport {

  protected readonly BiitProgressBarType = BiitProgressBarType;
  protected waiting: boolean = true;
  protected teams: ItemMap[] = [];
  protected organization: string;

  constructor(private authService: AuthService,
              private userManagerLoginService: UserManagerAuthService,
              private sessionServiceUserManager: UserManagerSessionService,
              private sessionService: SessionService,
              private userService: UserService,
              private teamService: TeamService,
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

    this.loadTeams();

  }

  login(login: BiitLogin): void {
    this.waiting = true;

    combineLatest(
      [
        this.userManagerLoginService.login(new LoginRequest(login.username, login.password)),
        this.authService.login(new LoginRequest(login.username, login.password))
      ]
    ).subscribe({
      next: ([userManagerResponse, authResponse]) => {
        const user: User = User.clone(userManagerResponse.body);
        if (!this.canAccess(user)) {
          this.waiting = false;
          this.translocoService.selectTranslate('403', {}, {scope:'biit-ui/utils'}).subscribe(msg => {
            this.biitSnackbarService.showNotification(msg, NotificationType.ERROR, null, 10);
          });
          return;
        }

        const userManagerToken: string = userManagerResponse.headers.get(Constants.HEADERS.AUTHORIZATION_RESPONSE);
        const userManagerExpiration: number = +userManagerResponse.headers.get(Constants.HEADERS.EXPIRES);
        this.sessionServiceUserManager.setToken(userManagerToken, userManagerExpiration, login.remember, true);
        this.sessionServiceUserManager.setUser(user);

        const authToken: string = authResponse.headers.get(Constants.HEADERS.AUTHORIZATION_RESPONSE);
        const authExpiration: number = +authResponse.headers.get(Constants.HEADERS.EXPIRES);
        this.sessionService.setToken(authToken, authExpiration, login.remember, true);
        this.sessionService.setUser(user);

        this.router.navigate([Constants.PATHS.FORM_VIEW],
          {queryParams: this.activateRoute.snapshot.queryParams});
      },
      error: (response: HttpResponse<void>) => {
        const error: string = response.status.toString();
        this.translocoService.selectTranslate(error, {},  {scope: 'biit-ui/utils'}).subscribe(msg => {
          this.biitSnackbarService.showNotification(msg, NotificationType.ERROR, null, 5);
        });
      }
    }).add(() => {
      this.waiting = false;
    });
  }

  private async loadTeams(): Promise<void> {

    const params: Params = await firstValueFrom(this.activateRoute.queryParams);
    this.organization = params['organization'];

    if (!Environment.SIGNUP_HIDE_TEAM && this.organization) {
      this.teamService.getAllByOrganizationPublic(this.organization).subscribe({
        next: (teams: string[]) => {
          this.teams = teams.map(team => new ItemMap(team, team));
        },
        error: error => console.error(error)
      });
    }
  }

  private canAccess(user: User): boolean {
    return user.applicationRoles && user.applicationRoles
      .some((value: string) => value.startsWith(Constants.APP.APP_PERMISSION_NAME));
  }


  private managePathQueries(): void {
    this.activateRoute.queryParams.subscribe(params => {
      const queryParams: { [key: string]: string } = {};
      if (params[Constants.PATHS.QUERY.EXPIRED] !== undefined) {
        this.translocoService.selectTranslate(Constants.PATHS.QUERY.EXPIRED, {}, {scope: 'login'}).subscribe(msg => {
          this.biitSnackbarService.showNotification(msg, NotificationType.INFO, null, 5);
        });
        queryParams[Constants.PATHS.QUERY.EXPIRED] = null;
      }
      if (params[Constants.PATHS.QUERY.LOGOUT] !== undefined) {
        this.sessionService.clearToken();
        this.translocoService.selectTranslate(Constants.PATHS.QUERY.LOGOUT, {}, {scope: 'login'}).subscribe(msg => {
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
        this.translocoService.selectTranslate('success', {}, {scope: 'biit-ui/login'}).subscribe(msg => {
          this.biitSnackbarService.showNotification(msg, NotificationType.SUCCESS, null, 5);
        });
      },
      error: error => ErrorHandler.notify(error, this.translocoService, this.biitSnackbarService)
    })
  }

  onSignUp(data: SignUpRequest): void {
    data.organization = this.organization;
    this.userService.signup(SignupRequestConverter.convertSignUpRequest(data)).subscribe({
      next: response => {
        const login = new BiitLogin(response.username, data.password)
        this.login(login);
      },
      error: err => ErrorHandler.notify(err, this.translocoService, this.biitSnackbarService)
    });
  }

  checkUserName(username: string): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      this.userService.checkUserName(username).subscribe({
        next: () => resolve(false),
        error: (error) => reject(error)
      });
    });
  }

  protected readonly Environment = Environment;
}
