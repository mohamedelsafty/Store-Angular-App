import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
  HttpStatusCode,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '@core/services/auth.service';
import { LoadingService } from '@core/services/loading.service';
import { TranslatorService } from '@core/services/utilites/translate.service';
import { catchError, finalize, Observable, switchMap, throwError } from 'rxjs';

export const httpInterceptor: HttpInterceptorFn = (req, next) => {
  const translatorService = inject(TranslatorService);
  const authService = inject(AuthenticationService);
  const lang = translatorService.currentLang;
  const router = inject(Router);
  const loadingService = inject(LoadingService);

  const addTokenToHeader = (
    req: HttpRequest<unknown>
  ): HttpRequest<unknown> => {
    return req.clone({
      setHeaders: {
        'Accept-Language': lang,
      },
    });
  };

  const redirectToLogin = (): void => {
    authService.logout();
    router.navigate(['/']);
  };

  const handleError = (
    error: HttpErrorResponse,
    authReq: HttpRequest<unknown>,
    next: HttpHandlerFn
  ): Observable<HttpEvent<unknown>> => {
    if (error.status === HttpStatusCode.Unauthorized) {
      catchError((error) => {
        redirectToLogin();
        return throwError(() => error);
      });
    }
    return throwError(() => error);
  };
  loadingService.showLoader();
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => handleError(error, req, next)),
    finalize(() => loadingService.hideLoader())
  );
};
