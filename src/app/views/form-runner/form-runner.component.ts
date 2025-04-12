import {AfterViewInit, Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ActivatedRoute, Params} from "@angular/router";
import {Form, FormResult} from "x-forms-lib";
import {BiitProgressBarType, BiitSnackbarService} from "biit-ui/info";
import {WebFormsService} from "../../services/web-forms.service";
import {EventService} from "../../services/events/event-service";
import {Subject} from "../../services/events/subject";
import {Constants} from "../../shared/constants";
import {SessionService} from "kafka-event-structure-lib";
import {OrganizationService} from "user-manager-structure-lib";
import {ErrorHandler} from "biit-ui/utils";
import {TranslocoService, TRANSLOCO_SCOPE} from "@ngneat/transloco";

@Component({
  selector: 'app-form-runner',
  templateUrl: './form-runner.component.html',
  styleUrls: ['./form-runner.component.scss'],
  providers: [
    {
      provide: TRANSLOCO_SCOPE,
      multi: true,
      useValue: {scope: 'form', alias: 'form'}
    }
  ]

})
export class FormRunnerComponent implements OnInit, AfterViewInit {

  constructor(private http: HttpClient,
              private eventService: EventService,
              private webFormsService: WebFormsService,
              private sessionService: SessionService,
              private organizationService: OrganizationService,
              private snackbarService: BiitSnackbarService,
              private transloco: TranslocoService,
              private route: ActivatedRoute) {
  }

  protected form: Form | undefined;
  private unprocessedForm: Form | undefined;
  protected submitted: boolean = false;
  protected submitting: boolean = false;
  protected loading: boolean = true;
  protected readonly biitProgressBarType = BiitProgressBarType;
  protected preview: boolean = false;

  protected preloadForm: boolean = false;
  protected preloadedForm: Form;

  ngOnInit(): void {
    this.route.data.subscribe((data): void => {
      if (data['preview']) {
        this.preview = true;
      }
    });
    this.organizationService.getAllByLoggedUser().subscribe(organizations => {
      if (organizations && organizations.length) {
        this.eventService.organization = organizations[0].id;
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
    this.route.queryParams.subscribe((params): void => {
      const formName: string = params['form'];
      const form: Form = JSON.parse(sessionStorage.getItem(formName));
      if (form) {
        this.preloadForm = true;
        this.preloadedForm = Form.import(form, this.getMapFromParams(params));
      } else {
        this.loadForm();
      }
    });
  }

  private loadForm(): void {
    this.loading = true;
    this.route.queryParams.subscribe({
      next: (params: Params): void => {
        if (this.preview) {
          this.webFormsService.getForm(params['form'], params['version'], params['organizationId']).subscribe({
            next: (form: Form): void => {
              this.unprocessedForm = form;
              this.form = Form.import(form, this.getMapFromParams(params));
            },
            error: (): boolean => this.loading = false
          })
        } else {
          if (params['form']) {
            if (params['version'] && params['organizationId']) {
              this.webFormsService.getPublished(params['form'], params['version'], params['organizationId']).subscribe(
                {
                  next: (form: Form): void => {
                    this.unprocessedForm = form;
                    this.form = Form.import(form, this.getMapFromParams(params));
                    console.debug('Form loaded from remote webforms server.');
                  },
                  error: (): void => {
                    console.error('Form was not found on remote service. We are trying to check the deployed ones.');
                    this.loadLocal(params['form'], params, params['version'], params['organizationId']);
                  }
                }
              )
            } else {
              this.loadLocal(params['form'], params, params['version'], params['organizationId']);
            }
          } else {
            this.loading = false
          }
        }
      },
      error: (): boolean => this.loading = false
    });
  }

  loadLocal(form: string, params: Params, version?: string, organization?: string): void {
    const organizationPrefix: string = organization ? "_org" + organization : "";
    const versionPrefix: string = version ? "_v" + version : "";
    const path: string = `assets/forms/${form}${versionPrefix}${organizationPrefix}.json`
    this.http.get(path)
      .subscribe({
        next: (form: any): void => {
          this.unprocessedForm = form;
          this.form = Form.import(form, this.getMapFromParams(params));
          console.debug(`Form ${form}${versionPrefix}${organizationPrefix}.json loaded from local assets.`);
        },
        error: (): void => {
          this.loading = false
          console.error(`Form ${form}${versionPrefix}${organizationPrefix}.json not found! Nothing to load.`);
          if (version && organization) {
            this.loadLocal(form, params);
          }
        }
      });
  }

  onCompleted(formResult: FormResult): void {
    if (!this.preview) {
      this.submitting = true;
      this.eventService.sendEvent(formResult, Form.name, this.unprocessedForm, Subject.SUBMITTED, undefined, Constants.TOPICS.FORM, EventService.REPLY_TO, this.form.label).subscribe({
        next: (): void => {
          this.submitted = true;
          this.sessionService.clearToken();
          if (this.getFormLocally(formResult.label)) {
            this.deleteLocally(formResult.label);
          }
        }, error: (err): void => {
          console.error('Error sending form to Kafka, check network tab');
          ErrorHandler.notify(err, this.transloco, this.snackbarService);
          this.submitting = false;
          this.saveLocally(this.form);
        }, complete: (): void => {
          this.submitting = false;
        }
      })
    }
  }

  private saveLocally(form: Form): void {
    sessionStorage.setItem(form.label, JSON.stringify(form));
  }

  private getFormLocally(formName: string): Form {
    const form: Form = JSON.parse(sessionStorage.getItem(formName));
    if (form) {
      return form;
    } else {
      return null;
    }
  }
  private deleteLocally(formName: string): void {
    sessionStorage.removeItem(formName);
  }
  protected onLoadPreForm(): void {
    this.preloadForm = false;
    this.unprocessedForm = this.preloadedForm;
    this.form = Form.clone(this.preloadedForm);
  }
  protected onRestart(): void {
    this.loadForm();
    this.preloadedForm = null;
    this.preloadForm = false;
  }
}
