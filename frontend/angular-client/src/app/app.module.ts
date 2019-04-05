import {BrowserModule} from '@angular/platform-browser';
import {ErrorHandler, NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {HTTP_INTERCEPTORS, HttpClientModule, HttpClientXsrfModule} from '@angular/common/http';

import {AppComponent} from './app.component';
import {HeaderUrlComponent} from './header-url/header-url.component';
import {ContentTableComponent} from './content-table/content-table.component';
import {UrlService} from './url.service';
import {HttpErrorInterceptor} from './http-error.interceptor';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ToastrModule} from 'ngx-toastr';
import {GlobalErrorHandler} from './global-error-handler';
import {HTTPListener, HTTPStatus} from './http-status.interceptor';
import { IgnoredKeywordsComponent } from './ignored-keywords/ignored-keywords.component';
import {DragDropModule} from '@angular/cdk/drag-drop';

@NgModule({
  declarations: [
    AppComponent,
    HeaderUrlComponent,
    ContentTableComponent,
    IgnoredKeywordsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule,
    HttpClientModule,
    HttpClientXsrfModule.withOptions({
      cookieName: 'csrftoken',
      headerName: 'X-CSRFToken',
    }),
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    DragDropModule
  ],
  providers: [
    UrlService,
    HTTPStatus,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HTTPListener,
      multi: true
    },
    {
      provide: ErrorHandler,
      useClass: GlobalErrorHandler
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
