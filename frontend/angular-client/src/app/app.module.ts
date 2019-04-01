import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { HeaderUrlComponent } from './header-url/header-url.component';
import { ContentTableComponent } from './content-table/content-table.component';
import {UrlService} from './url.service';

@NgModule({
  declarations: [
    AppComponent,
    HeaderUrlComponent,
    ContentTableComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule
  ],
  providers: [ UrlService ],
  bootstrap: [AppComponent]
})
export class AppModule { }
