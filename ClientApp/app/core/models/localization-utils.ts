export class LocalizationUtils {
  public static readonly languages = ['ru', 'ua', 'en'];
  public static get defaultLanguage(){
    return this.languages[0];
  }
  public static isUriLocalized(uri: string): boolean {
    const firstUriPart = uri.split('/')[1];
    const isContainsLang =  this.languages.findIndex(x => x == firstUriPart) !== -1;
    return isContainsLang;
  }

  public static getNormalizedUrl(url: string): string {
    const isLocalizedUri = LocalizationUtils.isUriLocalized(url);
    const languageLocale = LocalizationUtils.getLocale(url);
    const unlocalizedUrl = (isLocalizedUri ? url.slice(3, url.length) : url);
    const newUrl = (this.defaultLanguage === languageLocale) ? unlocalizedUrl : languageLocale + '/' + unlocalizedUrl;
    return newUrl;
  }

  public static localizeUrl(url: string, lang: string): string {
    const isLocalizedUri = LocalizationUtils.isUriLocalized(url);
    const unlocalizedUrl = (isLocalizedUri ? url.slice(3, url.length) : url);
    const newUrl = (this.defaultLanguage === lang) ? unlocalizedUrl : lang + '/' + unlocalizedUrl;
    return newUrl;
  }

  public static getLocale(url: string): string {
    const firstUriPart = url.split('/')[1];
    const urlLang = this.languages.filter(x => x == firstUriPart);
    const resLang = urlLang[0] || '';
    return resLang;
  }
}
