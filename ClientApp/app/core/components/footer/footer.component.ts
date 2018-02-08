import { Component, Inject, HostListener, ElementRef, AfterViewInit, PLATFORM_ID, OnInit } from '@angular/core';
import { isPlatformBrowser, Location } from '@angular/common';
import { trigger, style, transition, animate } from '@angular/animations';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';
// Models
import { ILang } from '../../models/lang';
import { FooterList, FooterListShown } from './footer-list';
import { AppConstants } from '../../../app.constants';
import { Config } from '../../config/env.config';
import { Category } from '../../models/service-menu/category';
import { LocalizationUtils } from '../../models/localization-utils';
// Services
import { StorageService } from '../../services/storage.service';
import { PublicService } from '../../services/public.service';
import { LocalizeRouterService } from '../../../shared/localize-router/localize-router.service';
import { SessionStateService } from '../../services/session-state.service';

@Component({
  selector: 'footer',
  templateUrl: 'footer.component.html',
  styleUrls: ['footer.component.scss'],
  animations: [trigger('SlideToggle', [
    transition(':enter', [
      style({ height: 0, overflow: 'hidden', paddingTop: 0, paddingBottom: 0 }),
      animate('0.3s ease-in', style({ height: '*', paddingTop: '*' }))
    ]),
    transition('* => void', [
      style({ overflow: 'hidden' }),
      animate('0.3s ease-out', style({ height: 0, paddingTop: 0 }))
    ])
  ])]
})

export class FooterComponent implements OnInit, AfterViewInit {
  alive: boolean;
  supporterLangs: Array<ILang>;
  langArray: any;
  lang: string;
  isFooterVisible: boolean = false;
  isMobileResolution: boolean = false;
  windowWidth: number = null;
  servicesNodesEven: Array<any> = new Array();
  servicesNodesOdd: Array<any> = new Array();
  currenYear: string = new Date().getFullYear().toString();
  public prevWindowWidth: number;
  public isBrowser: boolean = isPlatformBrowser(this.platform_id);
  public footerList: FooterList | FooterListShown = new FooterList();
  public defaultServiceMenuRoutePrefix: string = AppConstants.DEFAULT_SERVICE_MENU_ROUTE_PREFIX;

  constructor(
    @Inject(PLATFORM_ID) private platform_id: Object,
    public storageService: StorageService,
    public elRef: ElementRef,
    public router: Router,
    private translateService: TranslateService,
    public activatedRoute: ActivatedRoute,
    private publicService: PublicService,
    private localizeRouterService: LocalizeRouterService,
    private sessionStateService: SessionStateService,
    private location: Location
  ) {
    this.supporterLangs = Config.SUPPORTED_LANGUAGES;
    this.langArray = [];
    this.lang = this.sessionStateService.getLanguage();
    if (this.isBrowser) {
      this.prevWindowWidth = window.innerWidth;
      this.isMobileResolution = this.prevWindowWidth < 640 ? true : false;
      if (!this.isMobileResolution) this.footerList = new FooterListShown();
    }
  }

  ngOnInit() {
    this.supporterLangs.forEach((data: ILang) => {
      this.translateService.get(data.title).subscribe((val: string) => {
        this.langArray.push({ id: data.code, text: val });
      });
    });
  }

  ngAfterViewInit() {
    let serviceNodes: any;
    this.publicService.getCategories()
      .catch(err => Observable.of({}))
      .map(data => {
        let categories = data.serviceNodes[0].categories ?
          data.serviceNodes[0].categories.sort((a: Category, b: Category) => a.index - b.index) : [];
        return categories;
      })
      .subscribe((data) => {
        serviceNodes = data;
        if (serviceNodes) {
          this.servicesNodesOdd.push(...serviceNodes.slice(0, 4));
          this.servicesNodesEven.push(...serviceNodes.slice(4));
        }
      });

    if (this.isBrowser) {
      this.router.events.filter(e => e instanceof NavigationEnd).subscribe((val) => {
        let footerRest = this.elRef.nativeElement.querySelector('#footer-rest');
        this.isFooterVisible = !this.checkVisible(footerRest) && this.showFooterMenu();
        window.scroll(0, 0);
        if (this.isMobileResolution) this.footerList = new FooterList();
      });
      setTimeout(() => this.isFooterVisible = this.showFooterMenu(), 500);
    }
  }

  onMobileTitleClick(key: string): void {
    if (this.isMobileResolution) {
      if (this.footerList[key]) {
        this.footerList = new FooterList();
      } else {
        this.footerList = new FooterList();
        this.footerList[key] = true;
      }
    }
  }

  showFooterMenu() {
    let sizeWidth = window.parent.innerWidth;
    if (sizeWidth > 1023)
      return true;
    else return false;
  }

  isMainProfilePage(): Boolean {
    if (this.router.url === '/profile/payments')
      return true;
    else return false;
  }

  checkVisible(elm: any) {
    var rect = elm.getBoundingClientRect();
    var viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight);
    return !(rect.bottom < 0 || rect.top - viewHeight >= 0);
  }

  updateLangValue(event: string) {
    this.sessionStateService.setLanguage(event);
    const isLocalizedUri = LocalizationUtils.isUriLocalized(this.router.url);
    const unlocalizedUrl = (isLocalizedUri ? this.router.url.slice(4, this.router.url.length) : this.router.url);
    const newUrl = (LocalizationUtils.languages[0] === event) ? unlocalizedUrl : event + '/' + unlocalizedUrl;
    this.router.navigate([newUrl]);
    // this.location.go(newUrl);
    // this.location.
  }

  urlParser(url: string, lang: string): string {
    // default route - /
    let link = '/';
    if (lang === 'ru') {
      if (url.split('/').length > 2) {
        link = '/' + url.split('/').slice(2).join('/'); // example: '/CATEGORY-OTHER/KYIVSTAR'
      }
    } else {
      if (url.split('/').length > 3) {
        if (url.indexOf('/ua/') >= 0 || url.indexOf('/en/') >= 0) {
          link = '/' + lang + '/' + url.split('/').slice(2).join('/'); // example: '/en/CATEGORY-OTHER/KYIVSTAR'
        } else {
          link = '/' + lang + '/' + url.split('/').slice(1).join('/'); // example: '/en/CATEGORY-OTHER/KYIVSTAR'
        }
      }
      if (url.split('/').length > 2 && url.split('/').length <= 3) {
        link = '/' + lang + '/' + url.split('/').slice(1).join('/'); // example: '/en/CATEGORY-OTHER/KYIVSTAR'
      }
      if (url.split('/').length === 2) {
        link = '/' + lang; // // example: '/en'
      }
    }
    return link;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    let innerWidth = event.target.innerWidth;
    this.isMobileResolution = (innerWidth < 640) ? true : false;
    this.isFooterVisible = innerWidth > 1023;
    if (this.isMobileResolution) {
      if (this.prevWindowWidth !== innerWidth)
        this.footerList = new FooterList();
    } else {
      this.prevWindowWidth = innerWidth;
      this.footerList = new FooterListShown();
    }
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    let footerRest = this.elRef.nativeElement.querySelector('#footer-rest');
    this.isFooterVisible = !this.checkVisible(footerRest) && this.showFooterMenu();
  }
}

