import {Injectable} from '@angular/core';

// keys for storage (local or session)
export class StorageKeys {
  public static get ACCESS_TOKEN_KEY(): string {
    return 'auth_token';
  }

  public static get REFRESH_TOKEN_LIFETIME(): number {
    return 30;
  }

  public static get REFRESH_TOKEN_KEY(): string {
    return 'refresh_token';
  }

  public static get TOKEN_KEY(): string {
    return 'token';
  }

  public static get LANGUAGE(): string {
    return 'language';
  }

  public static get USER_LANGUAGE(): string {
    return 'ULang';
  }

  public static get APP_ID(): string {
    return 'AppId';
  }

  public static get PAGE_ID(): string {
    return 'PageId';
  }

  public static get REQUSTED_SESSION_ID(): string {
    return 'RequestedSessionId';
  }

  public static get PARTNER_KEY(): string {
    return 'easypay-v2';
  }

  public static get WINDOW_ID(): string {
    return 'window-id';
  }

  public static get USER_ID(): string {
    return 'userId';
  }

  public static get FORM_DATA(): string {
    return 'formData';
  }

  public static get EsPayPaymentFormKey(): string {
    return 'esPayPaymentForm';
  }

  public static get CARD_MASK(): string {
    return '[0-9]{16}|[0-9]{6}\\*{6}[0-9]{4}|[0-9]{4} [0-9]{4} [0-9]{4} [0-9]{4}|[0-9]{4} [0-9]{2}\\*{2} \\*{4} [0-9]{4}';
  }

  public static get PHONE_MASK(): string {
    return '([0-9]{12})|(\\+[0-9]{2} \\([0-9]{3}\\) [0-9]{3}-[0-9]{2}-[0-9]{2})';
  }

  public static get EMAIL_PATTERN(): string {
    return '^[a-z0-9]+(\\.[_a-z0-9]+)*@[a-z0-9-]+(\\.[a-z0-9-]+)*(\\.[a-z]{2,15})$';
  }
}

// base app constants
@Injectable()
export class AppConstants {
  public static get PHONE_MASK(): Array<string | RegExp> {
    return ['\+', '3', '8', '0', '(', /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-',
      /\d/, /\d/, '-', /\d/, /\d/];
  }

  public static get FORM_EXPIRATION_MINUTES(): number {
    return 30;
  }
  public static get DEFAULT_LOGO_ICON_NAME(): string {
    return 'logo-zaglushka';
  }
  public static readonly DEFAULT_SERVICE_MENU_ROUTE_PREFIX: string = '/catalog';
  public static get LOGO_ICONS_PATH(): string {
    return 'https://cdn.easypay.ua/logo/';
  }
}
