import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {Observable} from "rxjs";
import {Constants} from "../shared/constants";
import {Injectable} from "@angular/core";
import {SessionService} from "kafka-event-structure-lib";
import {SessionService as UserManagerSessionService} from "user-manager-structure-lib";

@Injectable()
export class HeaderInterceptor implements HttpInterceptor {

  constructor(private kafkaSessionService: SessionService,
              private userManagerSessionService: UserManagerSessionService) {

  }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const request: HttpRequest<any> = req.clone({
      headers: req.headers.append(Constants.HEADERS.AUTHORIZATION, this.getAuthorizationHeader(req.url) ),
    });
    return next.handle(request);
  }
  getAuthorizationHeader(url: string): string {
    if (url.includes(Constants.PATHS.KAFKA_CONTEXT)) {
      return `Bearer ${this.kafkaSessionService.getToken()}`;
    }
    else if  (url.includes(Constants.PATHS.USER_MANAGER_SYSTEM)) {
      return `Bearer ${this.userManagerSessionService.getToken()}`;
    } else {
      return `Basic ${btoa(Constants.HEADERS.USER_AUTHORIZATION + ':' + Constants.HEADERS.PASS_AUTHORIZATION)}`;
    }
  }
}
