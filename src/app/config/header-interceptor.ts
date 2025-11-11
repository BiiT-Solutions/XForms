import {HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {Observable} from "rxjs";
import {Constants} from "../shared/constants";
import {Injectable} from "@angular/core";
import {SessionService} from "@biit-solutions/kafka-event-structure";
import {SessionService as UserManagerSessionService} from "@biit-solutions/user-manager-structure";

@Injectable()
export class HeaderInterceptor implements HttpInterceptor {

  constructor(private kafkaSessionService: SessionService,
              private userManagerSessionService: UserManagerSessionService) {

  }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const reqHeaders: HttpHeaders = req.headers
      .append(Constants.HEADERS.CACHE_CONTROL, 'no-cache')
      .append(Constants.HEADERS.PRAGMA, 'no-cache');
    if (this.getAuthorizationHeader(req.url)) {
      const request: HttpRequest<any> = req.clone({
        headers: reqHeaders.append(Constants.HEADERS.AUTHORIZATION, this.getAuthorizationHeader(req.url) ),
      });
      return next.handle(request);
    } else {
      return next.handle(req.clone({
        headers: reqHeaders
      }));
    }
  }
  getAuthorizationHeader(url: string): string {
    if  (url.includes(Constants.PATHS.USER_MANAGER_SYSTEM)) {
      return `Bearer ${this.userManagerSessionService.getToken()}`;
    } else if(url.includes(Constants.PATHS.KAFKA_CONTEXT)) {
      return `Bearer ${this.kafkaSessionService.getToken()}`;
    }
    return null;
  }
}
