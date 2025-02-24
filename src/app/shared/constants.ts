export class Constants {
  public static readonly APP = class {
    public static readonly APP_PERMISSION_NAME: string = 'XFORMS';
  }
   public static readonly SESSION_STORAGE = class {
     public static readonly SESSION: string = 'session';
     public static readonly AUTH_TOKEN: string = 'authToken';
     public static readonly AUTH_EXPIRATION: string = 'authExp';
     public static readonly USER: string = 'user';
   }

  public static readonly TOPICS = class {
     public static readonly FORM: string = 'form';
  }
  public static readonly HEADERS = class {
    public static readonly AUTHORIZATION: string = 'Authorization';
    public static readonly AUTHORIZATION_RESPONSE: string = 'authorization';
    public static readonly EXPIRES: string = 'expires';

  }

   public static readonly PATHS = class {
     public static readonly KAFKA_CONTEXT: string = 'kafka-proxy-backend';
     public static readonly USER_MANAGER_SYSTEM: string = 'user-manager-system-backend';
     public static readonly ASSETS: string = './assets';
     public static readonly FORM_VIEW: string = '/';
     public static readonly ICONS: string = '/icons'
     public static readonly QUERY = class {
       public static readonly TOKEN_NOT_VALID: string = 'token-not-valid';
       public static readonly TEMPORAL_TOKEN: string = 'temporal-token';
       public static readonly EXPIRED: string = 'expired';
       public static readonly LOGOUT: string = 'logout';
     }
   }
}
