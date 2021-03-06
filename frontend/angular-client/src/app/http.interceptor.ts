import { Injectable } from '@angular/core';

import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler, HttpHeaders,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';

import {Observable, BehaviorSubject} from 'rxjs';
import {catchError, finalize, map} from 'rxjs/operators';

export class HttpHeader {
  static JSON_HEADER = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
}

@Injectable()
export class HTTPStatus {
  private requestInFlight$: BehaviorSubject<boolean>;
  private runningRequests: number;
  constructor() {
    this.requestInFlight$ = new BehaviorSubject(false);
    this.runningRequests = 0;
  }

  setHttpStatus(inFlight: boolean) {
    this.requestInFlight$.next(inFlight);
  }

  getHttpStatus(): Observable<boolean> {
    return this.requestInFlight$.asObservable();
  }

  addRunningRequest() {
    this.runningRequests++;
  }

  removeRunningRequest() {
    this.runningRequests--;
  }

  isRequestPending(): boolean {
    return this.runningRequests !== 0;
  }
}

@Injectable()
export class HTTPListener implements HttpInterceptor {
  constructor(private status: HTTPStatus) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    this.status.setHttpStatus(true);
    this.status.addRunningRequest();
    return next.handle(req).pipe(
      map(event => {
        return event;
      }),
      finalize(() => {
        this.status.removeRunningRequest();
        if (!this.status.isRequestPending()) {
          this.status.setHttpStatus(false);
        }
      }),
      catchError((error: HttpErrorResponse) => {
         throw new Error(error.error.message);
       })
    );
  }
}
