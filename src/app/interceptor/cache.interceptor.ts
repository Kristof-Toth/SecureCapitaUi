import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { HttpCacheService } from '../service/http.cache.service';

@Injectable()
export class CacheInterceptor implements HttpInterceptor {
  constructor(private httpCache: HttpCacheService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (
      request.url.includes('verify') ||
      request.url.includes('login') ||
      request.url.includes('register') ||
      request.url.includes('refresh') ||
      request.url.includes('resetpassword')
    ) {
      return next.handle(request);
    }

    if (request.method !== 'GET' || request.url.includes('download')) {
      this.httpCache.evictAll();
      //this.httpCache.evict(request.url);
      return next.handle(request);
    }

    const cachedResponse: HttpResponse<any> = this.httpCache.get(request.url);

    if (cachedResponse) {
      console.log('Found Response in Cache', cachedResponse);
      this.httpCache.logCache();
      return of(cachedResponse);
    }

    return this.handleRequestCache(request, next);
  }

  handleRequestCache(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      tap((response) => {
        if (response instanceof HttpResponse && request.method !== 'DELETE') {
          console.log('Caching Response', response);
          this.httpCache.put(request.url, response);
        }
      })
    );
  }
}
