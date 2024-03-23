import {AfterViewInit, Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ActivatedRoute} from "@angular/router";
import {Form} from "x-forms-lib";
import {Constants} from "x-forms-lib";
import {BiitProgressBarType} from "biit-ui/info";

@Component({
  selector: 'app-form-runner',
  templateUrl: './form-runner.component.html',
  styleUrls: ['./form-runner.component.scss']
})
export class FormRunnerComponent implements AfterViewInit {

  constructor(private http: HttpClient, private route: ActivatedRoute ) { }

  protected form: Form | undefined;
  protected loading: boolean = false;
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
}
