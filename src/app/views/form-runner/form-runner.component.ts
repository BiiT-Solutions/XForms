import {AfterViewInit, Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ActivatedRoute} from "@angular/router";
import {Form, FormResult} from "x-forms-lib";
import {Constants} from "x-forms-lib";
import {BiitProgressBarType} from "biit-ui/info";
import {Environment} from "../../../environments/environment";

@Component({
  selector: 'app-form-runner',
  templateUrl: './form-runner.component.html',
  styleUrls: ['./form-runner.component.scss']
})
export class FormRunnerComponent implements AfterViewInit {

  constructor(private http: HttpClient, private route: ActivatedRoute ) { }

  protected form: Form | undefined;
  protected submitted: boolean = false;
  protected loading: boolean = true;
  protected readonly BiitProgressBarType = BiitProgressBarType;

  ngAfterViewInit(): void {
    this.loading = true;
    this.route.queryParams.subscribe({
      next: (params) => {
        if (params['form']) {
          const path = `${Constants.FORM_PATH}/${params['form']}.json`
          this.http.get(path)
            .subscribe({
              next: (form: any) => {
                this.form = Form.clone(form);
              },
              error: () => this.loading = false
            });
        } else {
          this.loading = false
        }
      },
      error: () => this.loading = false
    })
  }

  onCompleted(formResult: FormResult) {
    this.http.post(Environment.ROOT_URL + Environment.KAFKA_PROXY_PATH, formResult).subscribe({
      next: () => {
        this.submitted = true;
      }, error: () => {
        console.error('Error sending form to Kafka, check network tab');
      }
    });
  }
}
