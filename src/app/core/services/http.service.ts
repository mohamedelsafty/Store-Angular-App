import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  private readonly httpClient = inject(HttpClient);

  get<T>(url: string, options: { [key: string]: unknown } = {}): Observable<T> {
    return this.httpClient.get<T>(url, options);
  }

  post<T>(url: string, data: unknown): Observable<T> {
    return this.httpClient.post<T>(url, data);
  }

  put<T>(url: string, data: unknown): Observable<T> {
    return this.httpClient.put<T>(url, data);
  }

  delete<T>(url: string): Observable<T> {
    return this.httpClient.delete<T>(url);
  }
}
