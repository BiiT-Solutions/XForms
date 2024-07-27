import {AfterViewInit, Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ActivatedRoute, Params} from "@angular/router";
import {Form, FormResult} from "x-forms-lib";
import {BiitProgressBarType} from "biit-ui/info";
import {Environment} from "../../../environments/environment";
import {WebFormsService} from "../../services/web-forms.service";

@Component({
  selector: 'app-form-runner',
  templateUrl: './form-runner.component.html',
  styleUrls: ['./form-runner.component.scss']
})
export class FormRunnerComponent implements OnInit, AfterViewInit {

  constructor(private http: HttpClient,
              private webFormsService: WebFormsService,
              private route: ActivatedRoute ) { }

  protected form: Form | undefined;
  protected submitted: boolean = false;
  protected loading: boolean = true;
  protected readonly BiitProgressBarType = BiitProgressBarType;
  protected preview: boolean = false;

  ngOnInit(): void {
    this.route.data.subscribe((data) => {
      if (data['preview']) {
        this.preview = true;
      }
    });
  }

  ngAfterViewInit(): void {
    this.loading = true;
    this.route.queryParams.subscribe({
      next: (params: Params): void => {
        if (this.preview) {
          this.webFormsService.getForm(params['form'], params['version'], params['organization']).subscribe( {
            next: (form: Form): void => {
              this.form = Form.clone(form);
            },
            error: (): boolean => this.loading = false
          })
        } else {
          if (params['form']) {
            if (params['version'] && params['organization']) {
              this.webFormsService.getPublished(params['form'], params['version'], params['organization']).subscribe(
                {
                  next: (form: Form): void => {
                    this.form = Form.clone(form);
                  },
                  error: (): void => {
                    console.error('Form was not found on remote service. We are trying to check the deployed ones.')
                    this.loadLocal(params['form'])
                  }
                }
              )
            } else {
              this.loadLocal(params['form'])
            }
          } else {
            this.loading = false
          }
        }
      },
      error: (): boolean => this.loading = false
    })
  }

  loadLocal(form: string) {
    const path: string = `assets/forms/${form}.json`
    this.http.get(path)
      .subscribe({
        next: (form: any): void => {
          this.form = Form.clone(form);
        },
        error: (): boolean => this.loading = false
      });
  }
  onCompleted(formResult: FormResult) {
    this.http.post(Environment.KAFKA_PROXY_URL + Environment.FORM_PATH, formResult).subscribe({
      next: (): void => {
        this.submitted = true;
      }, error: (): void => {
        console.error('Error sending form to Kafka, check network tab');
      }
    });
  }
}
