import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Form} from "x-forms-lib";
import {Environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class WebFormsService {

  constructor(private http: HttpClient) { }
  getForm(formName: string, version: string, organization: string): Observable<Form> {
    return this.http.get<Form>(
      `${Environment.WEB_FORMS_URL}/rest/forms/${formName}/versions/${version}/organizations/${organization}`,
      {headers: {Authorization: `Basic ${btoa(Environment.WEB_FORMS_CREDENTIALS)}`}}
    );
  }

  getPublished(formName: string, version: string, organization: string): Observable<Form> {
    return this.http.get<Form>(
      `${Environment.WEB_FORMS_URL}/rest/published-forms/${formName}/versions/${version}/organizations/${organization}`,
      {headers: {Authorization: `Basic ${btoa(Environment.WEB_FORMS_CREDENTIALS)}`}}
    );
  }
}
