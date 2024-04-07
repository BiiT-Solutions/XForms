import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {Observable} from "rxjs";
import {Constants} from "../shared/constants";
import {Injectable} from "@angular/core";
import {SessionService} from "kafka-event-structure-lib";

@Injectable()
export class HeaderInterceptor implements HttpInterceptor {

  constructor(private kafkaSessionService: SessionService) {

  }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const request: HttpRequest<any> = req.clone({
      headers: req.headers.append(Constants.HEADERS.AUTHORIZATION,
        'Bearer ' +  this.kafkaSessionService.getToken())
    });
    return next.handle(request);
  }
}
