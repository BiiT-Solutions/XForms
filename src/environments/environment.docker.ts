export class Environment {
  public static readonly ROOT_URL: string = 'DOCKER:PROTOCOL://DOCKER:MACHINE_DOMAIN';
  public static readonly FORM_PATH: string = '/events/topics/form';
  public static readonly KAFKA_PROXY_URL: string = 'DOCKER:PROTOCOL://DOCKER:KAFKA_PROXY_URL';
  public static readonly WEB_FORMS_URL: string = 'DOCKER:PROTOCOL://DOCKER:WEBFORMS_URL';
  public static readonly WEB_FORMS_CREDENTIALS: string = 'DOCKER:WEBFORMS_USER:DOCKER:WEBFORMS_PASSWORD';
}
