import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { isPlatformBrowser } from '@angular/common';
import { Directions, Languages } from '@core/enums/language.enum';
@Injectable({
  providedIn: 'root',
})
export class TranslatorService {
  constructor(
    private readonly translateService: TranslateService,
    @Inject(PLATFORM_ID) private readonly platformId: object
  ) {}
  initLang() {
    this.translateService.addLangs([Languages.Ar, Languages.En]);
    if (isPlatformBrowser(this.platformId)) {
      const savedLang: Languages =
        (localStorage.getItem('lang') as Languages) || Languages.En;
      this.translateService.setDefaultLang(savedLang);
      this.changeLang(savedLang);
    }
  }

  changeLang(lang: Languages) {
    this.translateService.use(lang);
    const htmlTag: HTMLHtmlElement = document.getElementsByTagName(
      'html'
    )[0] as HTMLHtmlElement;
    if (lang === Languages.En) {
      htmlTag.dir = Directions.ltr;
      htmlTag.lang = Languages.En;
    } else {
      htmlTag.dir = Directions.rtl;
      htmlTag.lang = Languages.Ar;
    }
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('lang', lang);
    }
  }

  get currentLang(): Languages {
    return (this.translateService.currentLang ||
      localStorage.getItem('lang') ||
      Languages.En) as Languages;
  }
}
