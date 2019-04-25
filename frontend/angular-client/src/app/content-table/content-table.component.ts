import {AfterContentInit, Component, OnDestroy, OnInit} from '@angular/core';
import {ContentUnit} from './contentUnit';
import {UrlService} from '../url.service';
import {HttpClient} from '@angular/common/http';
import {ServerResponseUnit} from './serverResponseUnit';
import {GlobalErrorHandler} from '../global-error-handler';
import {ContentService} from '../content.service';

@Component({
  selector: 'app-content-table',
  templateUrl: './content-table.component.html',
  styleUrls: ['./content-table.component.css'],
  providers: [GlobalErrorHandler]
})
export class ContentTableComponent implements OnInit, OnDestroy, AfterContentInit {

  public content: ContentUnit[];

  constructor(private urlService: UrlService, private contentService: ContentService,
              private http: HttpClient, private errorHandler: GlobalErrorHandler) {
  }

  ngOnInit() {
    this.content = [];
    this.urlService.urlToRetrieveContent.subscribe((url: string) => {
      this.retrieveContentFromUrl(url);
    });
  }

  ngAfterContentInit() {
    this.contentService.content.next(this.content);
  }

  ngOnDestroy() {
    this.urlService.urlToRetrieveContent.unsubscribe();
  }

  retrieveContentFromUrl(url: string) {
    this.content.splice(0, this.content.length);
    if (!url) {
      this.errorHandler.handleError({message: 'URL must not be empty!'});
    } else {
      this.http.get<ServerResponseUnit[]>('/api/retrieve_content?parse=' + url)
      .subscribe(
        res => {
          res.forEach(unit => {
            this.content.push(new ContentUnit(unit.tag, unit.text, false));
          });
          this.urlService.isGwtFetchEnabled.next(true);
        },
        error => {
          this.urlService.isGwtFetchEnabled.next(false);
          this.errorHandler.handleError(error);
        }
      );
    }
  }

  addContentUnit() {
    this.content.push(new ContentUnit('', '', true));
  }

  deleteContentUnit(index) {
    this.content.splice(index, 1);
  }

  editContentUnit(index) {
    this.content[index].isEditable = !this.content[index].isEditable;
  }
}
