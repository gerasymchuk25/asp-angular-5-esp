import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';
import { Config } from '../config/env.config';
// Models
import { ServiceNode } from '../models/service-menu/service-node';
import { Tag } from '../models/service-menu/tag';
import { Settings } from '../models/system/settings';
import { IApp } from '../models/app';
import { IErrorApp } from '../models/error-app';
import { PaymentProduct } from '../models/service-menu/payment-product';
// Services
import { StorageService } from './storage.service';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class PublicService {

  public settings: Settings;

  constructor(
    private http: Http,
    private storageService: StorageService,
    private translateService: TranslateService
  ) {
  }

  /**
   * Return all categories (uses in resolver)
   */
  getCategories(): Observable<any> {
    return this.http.get(Config.API + '/services/servicesByCategoryKey')
      .map((res: Response) => {
        let response = res.json();
        return response;
      });
    // .catch(this.handleError);
  }

  /**
   * Handle HTTP error
   */
  private handleError(error: any) {
    let errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    //console.error(errMsg); // log to console instead
    // return Observable.throw(errMsg);
  }

  /**
   * Return all tags (uses in resolver)
   */
  getTags(): Observable<Tag> {
    return this.http.get(Config.API + '/tags/all')
      .map((res: Response) => res.json());
  }

  /**
   * Return top n popular services
   * @param count : numbers of first top services
   */
  getPopularServices(count: number) {
    return this.http.get(Config.API + '/services/top?count=' + count + '&withCategory=true')
      .map((res: Response) => res.json());
  }

  /**
   * Return n new services
   * @param count : number of first new services
   */
  getNewServices(count: number) {
    return this.http.get(Config.API + '/services/new?count=' + count + '&withCategory=true')
      .map((res: Response) => res.json());
  }

  getAppId(): Observable<IApp> {
    return this.http.post(Config.API + '/system/createApp', null)
      .map((res: Response) => res.json());
  }

  getPageId(): Observable<IApp> {
    return this.http.post(Config.API + '/system/createPage', null)
      .map((res: Response) => res.json());
  }

  getCardIconClass(pan: string) {
    switch (pan.substring(0, 1)) {
      case '2':
      case '5':
      case '6':
        return 'icon-mc';
      case '4':
        return 'icon-visa';
      case '9':
        return 'icon-nsmep';
      default:
        return '';
    }
  }

  checkAppId(): Observable<IErrorApp> {
    return this.http.get(Config.API + '/system/check')
      .map((res: Response) => res.json());
  }

  /**
   * Seed method, return array of months for drop-down directive
   */
  getMonths(): Array<MonthForDropDown> {
    let months: Array<MonthForDropDown> = [];
    months.push({id:'01', text: '01'});
    months.push({id:'02', text: '02'});
    months.push({id:'03', text: '03'});
    months.push({id:'04', text: '04'});
    months.push({id:'05', text: '05'});
    months.push({id:'06', text: '06'});
    months.push({id:'07', text: '07'});
    months.push({id:'08', text: '08'});
    months.push({id:'09', text: '09'});
    months.push({id:'10', text: '10'});
    months.push({id:'11', text: '11'});
    months.push({id:'12', text: '12'});

    return months;
  }

  /**
   * Seed method, return array of years for drop-down directive
   * @param loopsNumber - the number of years wich will return
   */
  getYears(yearsNumber: number): Array<YearForDropDown> {
    let years: Array<YearForDropDown> = [];
    let currentDate = new Date();
    let currentYear = currentDate.getFullYear();
    for (let i = 0; i <= yearsNumber; i++) {
      years.push({id: (currentYear + i).toString().substr(-2), text: (currentYear + i).toString().substr(-2)});
    }
    return years;
  }
  /**
   * Seed method, return array of full years value
   * @param yearsNumber : the number of years for dropdown
   */
  getFullYears(yearsNumber: number): Array<YearForDropDown> {
    let fullYears: Array<YearForDropDown> = [];
    let currentDate = new Date();
    let currentYear = currentDate.getFullYear();
    for (let i = 0; i <= yearsNumber; i++) {
      fullYears.push({ id: (currentYear + i).toString(), text: (currentYear + i).toString() });
    }
    return fullYears;
  }

  /**
   * return settings for payments
   */
  getSettings(): Observable<ServiceNode> {
    return this.http.get(Config.API + '/system/settings')
      .map((res: Response) => res.json());
  }

  /**
   * Enable loader on body
   */
  enabledLoader() {
    this.storageService.setSessionItem('StartLoader', 'true');
  }

  _getAppId(): Promise<any> {
    return this.http.post(Config.API + '/system/createApp', null).toPromise().then(this.extractData);
    //return this.http.post(Config.API + '/system/createApp', null)
    // .map((res: Response) => res.json())
    // .catch(this.handleError);
  }

  _getPageId(): Promise<any> {
    return this.http.post(Config.API + '/system/createPage', null).toPromise().then(this.extractData);
    /* return this.http.post(Config.API + '/system/createPage', null)
      .map((res: Response) => res.json())
      .catch(this.handleError); */
  }

  _checkAppId(): Promise<any> {
    return this.http.get(Config.API + '/system/check').toPromise().then(this.extractData);
  }


  getFormData() {
    return this.storageService.getLocalItem('payment-form-data');
  }

  getPaymentProducts(): PaymentProduct[] {
    return this.storageService.getLocalItem('payment-product-form-data');
  }

  removePaymentProducts(): void {
    this.storageService.removeLocalItem('payment-product-form-data');
  }

  private extractData(res: Response) {
    let body = res ? res.json() : {};
    return body;
  }


  public getPeriodicalItems(): Promise<{id: string, text:string}[]> {
    const startArray = [
      { id: 'singly', text: 'Singly' },
      { id: 'daily', text: 'Daily' },
      { id: 'weekly', text: 'Weekly' },
      { id: 'monthly', text: 'Monthly' },
      { id: 'everyDayN', text: 'Every N Day' }
    ];

    const promises: any = startArray.map((currentItem: { id: string, text: string }) =>
      this.translateService.get('shared.periodic.frequency.' + currentItem.id).toPromise()
    );

    return Promise.all(promises)
      .then((data: any[]) => {
        let rusultArray = [...startArray];
        for (let i = 0; i < data.length; i++) {
          if (startArray.length > i)
            rusultArray[i].text = data[i];
        }
        return rusultArray;
      });
  }
}

class MonthForDropDown {
  constructor(public id: string, public text: string) { }
}

class YearForDropDown {
  constructor(public id: string, public text: string) { }
}

