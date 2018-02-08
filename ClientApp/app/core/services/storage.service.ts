import { Injectable } from '@angular/core';
import { LocalStorageService, SessionStorageService } from 'ngx-webstorage';
import { Subject } from 'rxjs/Subject';
import { StorageKeys } from '../../app.constants';

@Injectable()
export class StorageService {
  constructor(
    private localStorage: LocalStorageService,
    private sessionStorage: SessionStorageService) {
  }

  private tokenUpdateAnnouncedSource = new Subject<boolean>();

  tokenUpdateAnnounced$ = this.tokenUpdateAnnouncedSource.asObservable();

  announcedTokenUpdate(status: boolean) {
    this.tokenUpdateAnnouncedSource.next(status);
  }

  // getters
  public getSessionItem(key: string) {
    return this.sessionStorage.retrieve(key);
  }

  public getLocalItem(key: string) {
    return this.localStorage.retrieve(key);
  }

  // setters
  public setSessionItem(key: string, value: any) {
    this.sessionStorage.store(key, value);
  }

  public setLocalItem(key: string, value: any) {
    this.localStorage.store(key, value);
  }

  // remove
  public removeSessionItem(key: string) {
    this.sessionStorage.clear(key);
  }

  public removeLocalItem(key: string) {
    this.localStorage.clear(key);
  }

  // custom methods
  public getAccessToken() {
    return this.getSessionItem(StorageKeys.ACCESS_TOKEN_KEY);
  }

  public removeAccessToken() {
    this.removeSessionItem(StorageKeys.ACCESS_TOKEN_KEY);
    this.removeSessionItem(StorageKeys.TOKEN_KEY);

    this.removeLocalItem(StorageKeys.ACCESS_TOKEN_KEY);
    this.removeLocalItem(StorageKeys.TOKEN_KEY);
  }

  public setAccessToken(accessToken: any, tokenKey: any) {
    this.setSessionItem(StorageKeys.ACCESS_TOKEN_KEY, accessToken);
    this.setSessionItem(StorageKeys.TOKEN_KEY, tokenKey);
  }

  public getLocalRefreshToken() {
    return this.getLocalItem(StorageKeys.REFRESH_TOKEN_KEY);
  }

  public setRefreshToken(refreshToken: any) {
    this.setLocalItem(StorageKeys.REFRESH_TOKEN_KEY, refreshToken);
  }

  public removeRefreshToken() {
    this.removeLocalItem(StorageKeys.REFRESH_TOKEN_KEY);
  }

  public setLocalAccessToken(accessToken: any, tokenKey: any) {
    this.setLocalItem(StorageKeys.ACCESS_TOKEN_KEY, accessToken);
    this.setLocalItem(StorageKeys.TOKEN_KEY, tokenKey);
  }

  public getLocalAccessToken() {
    return this.getLocalItem(StorageKeys.ACCESS_TOKEN_KEY);
  }

  public removeLocalUserId() {
    this.removeLocalItem(StorageKeys.USER_ID);
  }

  public getLocalUserId() {
    return this.getLocalItem(StorageKeys.USER_ID);
  }

}



