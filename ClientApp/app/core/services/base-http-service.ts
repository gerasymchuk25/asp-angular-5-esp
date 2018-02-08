import { Http, URLSearchParams } from '@angular/http';
import { Config } from '../config/env.config';

export class BaseHttpService {

  protected baseHttp: Http;
  private url: string;

  constructor(url: string = null, http: Http = null) {
    this.url = url;
    if (url && http === null) {
      // this.baseHttp = injector.get(Http);
    } else {
      this.baseHttp = http;
    }
  }

  public createUriParams(data: any): URLSearchParams {
    const objectParams = Object.getOwnPropertyNames(data)
      .reduce((params: URLSearchParams, key) => {
        params.set(key, data[key]);
        return params;
      }, new URLSearchParams());
    return objectParams;
  }

  protected get(url: string = '', params: Object = null, mapResult: Function = null) {
    url = this.bindUrl(this.createUrlByParts(this.url, url), params);

    return this.baseHttp
      .get(url)
      .map((response: any) => {
        let result = this.processResponse(response);
        if (mapResult !== null) {
          mapResult(result);
        }
        return result;
      })
      .catch((response) => {
        var error = this.processError(response);
        return Promise.reject(error);
      });
  }

  protected post(url: string = '', params: Object = null) {
    return this.baseHttp
      .post(this.createUrlByParts(this.url, url), params)
      .map((response: any) => {
        return this.processResponse(response);
      })
      .catch((response) => {
        var error = this.processError(response);
        return Promise.reject(error);
      });
  }

  protected put(url: string = '', params: Object = null) {
    return this.baseHttp
      .put(this.bindUrl(this.url + url), params)
      .map((response: any) => {
        return this.processResponse(response);
      })
      .catch((response) => {
        var error = this.processError(response);
        return Promise.reject(error);
      });
  }

  protected delete(url: string = '', params: Object = null) {
    return this.baseHttp
      .delete(this.bindUrl(this.url + url), params)
      .map((response: any) => {
        return this.processResponse(response);
      })
      .catch((response) => {
        var error = this.processError(response);
        return Promise.reject(error);
      });
  }


  protected processError(response: any) {
    if (response['_body']) {
      let body = response.json();
      if (body) {
        return body;
      }
    }

    let errMsg = (response.message) ? response.message :
      response.status ? `${response.status} - ${response.statusText}` : 'Server error';
    console.error(errMsg);
    return errMsg;
  }

  protected processResponse(response: any) {
    if (!response['_body']) return {};
    let body = response.json();
    return body || {};
  }

  public bindUrl(url: string = '', params: any = null) {
    let result = this.createUrlByParts(Config.API, url);
    return this.bindUrlParameters(result, params);
  }

  private createUrlByParts(url: string, part: string) {
    if (part) {
      if (url.lastIndexOf('/') !== (url.length - 1) && part.slice(0, 1) !== '/') {
        url += '/';
      } else if ((url.lastIndexOf('/') === (url.length - 1) && part.slice(0, 1) === '/')) {
        url = url.slice(0, url.length - 1);
      }
      url += part;
    }
    return url;
  }

  private bindUrlParameters(url: string, params: any = null) {
    if (params !== null && typeof params !== 'undefined') {
      if (url.indexOf('?') === -1) {
        url += '?';
      }
      let urlStr = '';
      for (let key in params) {
        if (urlStr !== '') {
          urlStr += '&';
        }
        urlStr += key + '=' + encodeURIComponent(params[key]);
      }
      url += urlStr;
    }
    return url;
  }
}
