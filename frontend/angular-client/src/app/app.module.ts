import {BrowserModule} from '@angular/platform-browser';
import {ErrorHandler, NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
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
  MatButtonModule, MatAutocompleteModule, MatDialogModule, MatCheckboxModule
} from '@angular/material';
import { GwtTableComponent } from './gwt-table/gwt-table.component';
import {ContentService} from './content.service';
import { PhraseAnalysisComponent } from './phrase-analysis/phrase-analysis.component';
import { AnalysisTableComponent } from './phrase-analysis/analysis-table/analysis-table.component';
import { DialogComponent } from './header-url/dialog/dialog.component';
import { GwtIndexingComponent } from './gwt-indexing/gwt-indexing.component';
import { LinksCheckerComponent } from './links-checker/links-checker.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderUrlComponent,
    ContentTableComponent,
    GwtTableComponent,
    PhraseAnalysisComponent,
    AnalysisTableComponent,
    DialogComponent,
    GwtIndexingComponent,
    LinksCheckerComponent
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
    MatButtonModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatDialogModule,
    MatCheckboxModule
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
  bootstrap: [AppComponent],
  entryComponents: [DialogComponent]
})
export class AppModule {
}
