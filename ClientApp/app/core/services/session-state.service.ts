import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { CookieService, CookieOptions } from 'ngx-cookie';
import { StorageKeys } from '../../app.constants';
import { StorageService } from './storage.service';
import { TokenModelResponse } from '../models/auth/token-model-response';
import { CookieValue } from '../models/cookie-value';

@Injectable()
export class SessionStateService {
  constructor(
    public storageService: StorageService,
    public cookieService: CookieService,
    @Inject(PLATFORM_ID) public platformId: Object
  ) {
  }

  private addMinutesToDate(date:Date, minutes:number): Date {
    return new Date(date.getTime() + minutes*60000);
  }

  public authorize(authData: TokenModelResponse): void {
    this.setToken(authData);
    this.setRefreshToken(authData);
    this.setUserId(authData);
  }

  public getToken = () => this.getCookieItem(StorageKeys.TOKEN_KEY);
  public getRefreshToken = () => this.getCookieItem(StorageKeys.REFRESH_TOKEN_KEY);
  public getUserId = () => this.getCookieValue(StorageKeys.USER_ID);
  public getLanguage(): string {
    const cookieItem = this.cookieService.get(StorageKeys.USER_LANGUAGE);
    return cookieItem;
  }

  public refreshAuth(authData: TokenModelResponse): void {
    this.authorize(authData);
  }
  public logout(): void {
    this.cookieService.remove(StorageKeys.REFRESH_TOKEN_KEY);
    this.cookieService.remove(StorageKeys.USER_ID);
    this.cookieService.remove(StorageKeys.TOKEN_KEY);
  }

  public getCookieItem(key: string): string {
    const cookieItem = <CookieValue>this.cookieService.getObject(key);
    return this.isCookieItemExpired(cookieItem) ? undefined : cookieItem.value;
  }

  public getCookieValue(key: string): string {
    const cookieItem = this.cookieService.get(key);
    return cookieItem;
  }

  private isCookieItemExpired(cookieItem: CookieValue) {
    const currentDate = new Date();
    return !(cookieItem && new Date(cookieItem.expirationDate) > currentDate);
  }

  private setUserId(authData: TokenModelResponse) {
    this.cookieService.put(StorageKeys.USER_ID, authData.userId, <CookieOptions>{
      expires: new Date(authData['.expires'])
    });
  }

  public setLanguage(language: string): void {
    let date = new Date();
    date = new Date(date.setDate(date.getDate() + 20));
    this.cookieService.put(
      StorageKeys.USER_LANGUAGE,
      language,
      <CookieOptions>{ expires: date }
    );
  }

  private setRefreshToken(authData: TokenModelResponse) {
    const refreshTokenLifetime =this.addMinutesToDate(new Date(), StorageKeys.REFRESH_TOKEN_LIFETIME);
    this.cookieService.putObject(StorageKeys.REFRESH_TOKEN_KEY,
      <CookieValue>{ value: authData.refresh_token, expirationDate: new Date(refreshTokenLifetime) },
      <CookieOptions>{
        expires: refreshTokenLifetime
      });
  }

  private setToken(authData: TokenModelResponse) {
    this.cookieService.putObject(StorageKeys.TOKEN_KEY,
      <CookieValue>{ value: authData.access_token, expirationDate: new Date(authData['.expires']) }, <CookieOptions>{
        expires: new Date(authData['.expires'])
      });
  }
}

