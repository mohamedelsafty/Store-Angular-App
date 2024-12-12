import {
  HttpInterceptorFn,
  HttpRequest,
  HttpHandler,
  HttpErrorResponse,
  HttpStatusCode,
} from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

export const HttpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const snackBar = inject(MatSnackBar);
  const router = inject(Router);
  const translateService = inject(TranslateService);
  let errorMessage = '';
  const errorMessages: { [key in HttpStatusCode]?: string | null } = {
    [HttpStatusCode.BadRequest]: 'ErrorMessages.badRequest',
    [HttpStatusCode.NotFound]: 'ErrorMessages.notFound',
    [HttpStatusCode.InternalServerError]: 'ErrorMessages.serverError',
    [HttpStatusCode.Unauthorized]: null, // No message for Unauthorized, just redirect
  };

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === HttpStatusCode.Unauthorized) {
        router.navigate(['/']);
      } else {
        const translationKey =
          errorMessages[error.status as HttpStatusCode] ||
          'ErrorMessages.genericError';
        translateService.get(translationKey).subscribe((res: string) => {
          errorMessage =
            translationKey === 'ErrorMessages.genericError'
              ? `${res}: ${error.message}`
              : res;
          snackBar.open(errorMessage, 'Close', {
            duration: 3000,
          });
        });
      }

      return throwError(() => new Error(errorMessage));
    })
  );
};
