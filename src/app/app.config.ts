import {
  ApplicationConfig,
  provideZoneChangeDetection,
  importProvidersFrom,
  APP_INITIALIZER,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {
  HttpClient,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import {
  provideTranslateService,
  TranslateLoader,
  TranslateModule,
} from '@ngx-translate/core';
import { TranslatorService } from '@core/services/utilites/translate.service';
import { initializeApp } from './app.initializer';
import { HttpErrorInterceptor } from '@core/interceptors/error-handler.interceptor';
import { Languages } from '@core/enums/language.enum';
import { BASE_API_URL } from '@core/constants/injection-tokens';
import { environment } from '@env/environment';
import { httpInterceptor } from '@core/interceptors/http.interceptor';

function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([httpInterceptor, HttpErrorInterceptor])
    ),
    provideAnimationsAsync(),
    provideTranslateService({
      defaultLanguage: Languages.En,
    }),
    {
      provide: BASE_API_URL,
      useValue: environment.baseUrl,
    },
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      multi: true,
      deps: [TranslatorService],
    },
    importProvidersFrom([
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient],
        },
      }),
    ]),
  ],
};
