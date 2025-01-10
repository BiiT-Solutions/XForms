export class Environment {
  public static readonly ROOT_URL: string = 'DOCKER:PROTOCOL://DOCKER:MACHINE_DOMAIN';
  public static readonly FORM_PATH: string = '/events/topics/form';
  public static readonly KAFKA_PROXY_URL: string = 'DOCKER:KAFKA_PROXY_URL';
  public static readonly USER_MANAGER_URL: string = 'DOCKER:USER_MANAGER_URL';
  public static readonly WEB_FORMS_URL: string = 'DOCKER:WEBFORMS_URL';
  public static readonly WEB_FORMS_CREDENTIALS: string = 'DOCKER:WEBFORMS_USER:DOCKER:WEBFORMS_PASSWORD';

  public static SIGNUP_ALLOW = 'DOCKER:SIGNUP_ALLOW';
  public static SIGNUP_HIDE_PASSWORD = 'DOCKER:SIGNUP_HIDE_PASSWORD';
  public static SIGNUP_HIDE_USERNAME = 'DOCKER:SIGNUP_HIDE_USERNAME';
  public static SIGNUP_HIDE_TEAM = 'DOCKER:SIGNUP_HIDE_TEAM_ASSIGNMENT';
}
