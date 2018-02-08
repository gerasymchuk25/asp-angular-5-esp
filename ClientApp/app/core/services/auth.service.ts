import { Injectable  } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Rx';
import { Subject } from 'rxjs/Subject';
// Services
import { BaseHttpService } from './base-http-service';
import { StorageService } from './storage.service';
import { SessionStateService } from './session-state.service';
import { CookieService } from 'ngx-cookie';
import { Config } from '../config/env.config';
import { StorageKeys } from '../../app.constants';
import { AnnounceSignIn } from '../models/auth/announce-sign-in';
import { TokenModelResponse } from '../models/auth/token-model-response';
import { RestorePassword } from '../models/auth/restore-password';

@Injectable()
export class AuthService extends BaseHttpService {
  subscription: Subscription;
  public loggedIn = false;
  public authState = new Subject<boolean>();

  // Observable signIn source
  public signInAnnouncedSource = new Subject<AnnounceSignIn>();

  public updateUserDataAnnouncedSource = new Subject<any>();

  // Observable signIn stream
  signInAnnounced$ = this.signInAnnouncedSource.asObservable();

  updateUserDataAnnounced$ = this.signInAnnouncedSource.asObservable();


  constructor(
    public http: Http,
    public storageService: StorageService,
    public cookieService: CookieService,
    public sessionStateService: SessionStateService
  ) {
    super();
    this.loggedIn = !!this.sessionStateService.getToken();
  }


  AuthState() {
    return this.authState.asObservable();
  }

  announceSignIn(state: AnnounceSignIn) {
    this.signInAnnouncedSource.next(state);
  }

  announceUpdateUserData(data: any) {
    this.updateUserDataAnnouncedSource.next(data);
  }

  refresh() {
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    headers.append('PartnerKey', StorageKeys.PARTNER_KEY);
    let refreshToken = this.storageService.getLocalRefreshToken();
    let loginFormData = 'grant_type=refresh_token&refresh_token=' + refreshToken + `&client_id=${StorageKeys.PARTNER_KEY}`;
    return this.http
      .post(this.bindUrl('/token'), loginFormData, { headers: headers });
  }

  login(username: string, password: string) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    headers.append('PartnerKey', StorageKeys.PARTNER_KEY);
    let loginFormData = 'grant_type=password&username=' + username + '&password=' + password + `&client_id=${StorageKeys.PARTNER_KEY}`;
    return this.http
      .post(this.bindUrl('/token'), loginFormData, { headers: headers })
      .map((res: any) => {
        const result: TokenModelResponse = res.json();
        this.sessionStateService.authorize(result);
        this.loggedIn = true;
        this.authState.next(true);
      })
      .catch((response) => {
        var error = this.processError(response);
        return Promise.reject(error);
      });
  }

  public logout(): void {
    this.sessionStateService.logout();

    this.storageService.removeAccessToken();
    this.storageService.removeRefreshToken();
    this.cookieService.remove('token');
    this.storageService.removeLocalUserId();
    this.loggedIn = false;
    this.authState.next(false);
  }

  resendOtpCode() {
    // todo add logic
  }

  register(phone: string, password: string) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('PartnerKey', StorageKeys.PARTNER_KEY);
    var registerData = {
      phone: phone.trim().replace(/\+| |\(|\)|-/g, ''),
      password: password
    };
    var config = { headers: headers };
    return this.http
      .post(Config.API + '/auth/register', registerData, config)
      .map((response: any) => {
        return this.processResponse(response);
      })
      .catch((response) => {
        var error = this.processError(response);
        return Promise.reject(error);
      });
  }

  confirmRegister(code: string, phone: string) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('PartnerKey', StorageKeys.PARTNER_KEY);
    var registerData = {
      code: code,
      phone: phone.trim().replace(/\+| |\(|\)|-/g, '')
    };
    var config = { headers: headers };
    return this.http
      .post(Config.API + '/auth/confirmRegistration', registerData, config)
      .map((response) => {
        return this.processResponse(response);
      })
      .catch((response) => {
        var error = this.processResponse(response);
        return Promise.reject(error);
      });
  }

  public restorePassword(restorePassword: RestorePassword): Observable<any> {
    return this.http
      .post(
        this.bindUrl('/auth/restorePassword'),
        JSON.stringify(restorePassword)
      )
      .map((response: any) => {
        return this.processResponse(response);
      })
      .catch((response) => {
        let error = this.processError(response);
        return Promise.reject(error);
      });
  }

  restoreUser(phone: string, password: string) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('PartnerKey', StorageKeys.PARTNER_KEY);

    let restoreData = {
      phone: phone.trim().replace(/\+| |\(|\)|-/g, ''),
      password: password
    };
    var config = { headers: headers };

    return this.http
      .post(Config.API + '/auth/restoreUser', restoreData, config)
      .map((response) => {
        return this.processResponse(response);
      })
      .catch((response) => {
        var error = this.processResponse(response);
        return Promise.reject(error);
      });
  }

  public confirmRestorePassword(verifyCode: string) {
    return this.http
      .post(
        this.bindUrl('/profile/confirmPasswordChange'),
        JSON.stringify({
          verifyCode: verifyCode
        })
      )
      .map((response: any) => {
        return this.processResponse(response);
      })
      .catch((response) => {
        let error = this.processError(response);
        return Promise.reject(error);
      });
  }

  verificateSession(code: string) {
    let param: any = { vCode: code };
    return this.http
      .post(this.bindUrl('/auth/verificateSession'), param)
      .map((response: any) => {
        return this.processResponse(response);
      })
      .catch((response: any) => {
        var error = this.processError(response);
        return Promise.reject(error);
      });
  }

  /**
   * Check token value from local storage
   */
  isLoggedIn(): boolean {
    const isToken = !!this.sessionStateService.getToken();
    const isRefreshToken = !!this.sessionStateService.getRefreshToken();
    if((!isToken && isRefreshToken)) {
      console.log('no token');
    }
    return isToken || (!isToken && isRefreshToken);
  }

  passwordRequirementsCheck(password: string): boolean {
    /**
     * Password pattern description:
     * 1. ^	- The password string will start this way
     * 2. (?=.*[a-z])	        - The string must contain at least 1 lowercase alphabetical character
     * 3. (?=.*[A-Z])	        - The string must contain at least 1 uppercase alphabetical character
     * 4. (?=.*[0-9])	        - The string must contain at least 1 numeric character
     * 5. (?=.*[!@#\$%\^&\*])	- The string must contain at least one special character,
     *                          but we are escaping reserved RegEx characters to avoid conflict
     * 6. (?=.{8,})	          - The string must be eight characters or longer.
     *
     * Simple example: '123qweQWE@#$'
     */
    const strongPattern = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})');
    return strongPattern.test(password);
  }

}
