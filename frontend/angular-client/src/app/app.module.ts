import {BrowserModule} from '@angular/platform-browser';
import {ErrorHandler, NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {HTTP_INTERCEPTORS, HttpClientModule, HttpClientXsrfModule} from '@angular/common/http';

import {AppComponent} from './app.component';
import {HeaderUrlComponent} from './header-url/header-url.component';
import {ContentTableComponent} from './content-table/content-table.component';
import {UrlService} from './url.service';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ToastrModule} from 'ngx-toastr';
import {GlobalErrorHandler} from './global-error-handler';
import {HTTPListener, HTTPStatus} from './http.interceptor';
import {IgnoredKeywordsComponent} from './ignored-keywords/ignored-keywords.component';
import {
  MatInputModule,
  MatPaginatorModule,
  MatProgressSpinnerModule,
  MatSortModule,
  MatTableModule,
  MatSelectModule,
  MatDatepickerModule,
  MatSlideToggleModule,
  MatNativeDateModule,
  MatButtonModule
} from '@angular/material';
import { KeywordsTableComponent } from './ignored-keywords/keywords-table/keywords-table.component';
import { GwtTableComponent } from './gwt-table/gwt-table.component';
import {ContentService} from './content.service';

@NgModule({
  declarations: [
    AppComponent,
    HeaderUrlComponent,
    ContentTableComponent,
    IgnoredKeywordsComponent,
    KeywordsTableComponent,
    GwtTableComponent
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
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatDatepickerModule,
    MatSlideToggleModule,
    MatNativeDateModule,
    MatButtonModule
  ],
  providers: [
    UrlService,
    ContentService,
    HTTPStatus,
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
