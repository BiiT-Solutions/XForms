import {AfterViewInit, Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ActivatedRoute, Params} from "@angular/router";
import {Form, FormResult} from "x-forms-lib";
import {BiitProgressBarType} from "biit-ui/info";
import {Environment} from "../../../environments/environment";
import {WebFormsService} from "../../services/web-forms.service";
import {EventService} from "../../services/events/event-service";
import {Subject} from "../../services/events/subject";
import {Constants} from "../../shared/constants";

@Component({
  selector: 'app-form-runner',
  templateUrl: './form-runner.component.html',
  styleUrls: ['./form-runner.component.scss']
})
export class FormRunnerComponent implements OnInit, AfterViewInit {

  constructor(private http: HttpClient,
              private eventService: EventService,
              private webFormsService: WebFormsService,
              private route: ActivatedRoute ) { }

  protected form: Form | undefined;
  protected submitted: boolean = false;
  protected submitting: boolean = false;
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

  getMapFromParams(params: Params): Map<string, any> {
    const map: Map<string, any> = new Map<string, any>();
    if (!params) {
      return map;
    }
    for (let key in params) {
      map.set(key, params[key]);
    }
    return map;
  }

  ngAfterViewInit(): void {
    this.loading = true;
    this.route.queryParams.subscribe({
      next: (params: Params): void => {
        if (this.preview) {
          this.webFormsService.getForm(params['form'], params['version'], params['organization']).subscribe( {
            next: (form: Form): void => {
              this.form = Form.import(form, this.getMapFromParams(params));
            },
            error: (): boolean => this.loading = false
          })
        } else {
          if (params['form']) {
            if (params['version'] && params['organization']) {
              this.webFormsService.getPublished(params['form'], params['version'], params['organization']).subscribe(
                {
                  next: (form: Form): void => {
                    this.form = Form.import(form, this.getMapFromParams(params));
                  },
                  error: (): void => {
                    console.error('Form was not found on remote service. We are trying to check the deployed ones.');
                    this.loadLocal(params['form'], params);
                  }
                }
              )
            } else {
              this.loadLocal(params['form'], params);
            }
          } else {
            this.loading = false
          }
        }
      },
      error: (): boolean => this.loading = false
    })
  }

  loadLocal(form: string, params: Params) {
    const path: string = `assets/forms/${form}.json`
    this.http.get(path)
      .subscribe({
        next: (form: any): void => {
          this.form = Form.import(form, this.getMapFromParams(params));
        },
        error: (): boolean => this.loading = false
      });
  }
  onCompleted(formResult: FormResult) {
    if (!this.preview) {
      this.submitting = true;
      this.eventService.sendEvent(formResult, Form.name, Subject.SUBMITTED, undefined, Constants.TOPICS.FORM).subscribe( {
        next: (): void => {
          this.submitted = true;
        }, error: (): void => {
          console.error('Error sending form to Kafka, check network tab');
        }, complete: (): void => {
          this.submitting = false;
        }
      })
    }
  }
}
