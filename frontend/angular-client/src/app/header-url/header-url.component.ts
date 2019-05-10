import {Component, Inject, Injector, OnDestroy, OnInit} from '@angular/core';
import {UrlService} from '../url.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ContentService} from '../content.service';
import {KeywordUnit} from '../gwt-table/keywordUnit';
import {ContentUnit} from '../content-table/contentUnit';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {SavedUrl} from './savedUrl';
import {ToastrService} from 'ngx-toastr';
import {DialogComponent} from './dialog/dialog.component';
import {MatDialog} from '@angular/material';
import {HttpHeader} from '../http.interceptor';

@Component({
  selector: 'app-header-url',
  templateUrl: './header-url.component.html',
  styleUrls: ['./header-url.component.css']
})
export class HeaderUrlComponent implements OnInit, OnDestroy {

  urlControl = new FormControl();
  public url: SavedUrl | string = '';
  keywordsData: KeywordUnit[];
  content: ContentUnit[];
  savedUrls: SavedUrl[] = [];
  filteredUrls: Observable<SavedUrl[]>;

  constructor(private urlService: UrlService, private http: HttpClient, private contentService: ContentService,
              @Inject(Injector) private readonly injector: Injector, public dialog: MatDialog) {
  }

  ngOnInit() {
    this.contentService.content.subscribe((content: ContentUnit[]) => {
      this.content = content;
    });
    this.contentService.keywords.subscribe((keywordsData: KeywordUnit[]) => {
      this.keywordsData = keywordsData;
    });

    this.fetchSavedUrls(() => {
      this.filteredUrls = this.urlControl.valueChanges
        .pipe(
          startWith<string | SavedUrl>(''),
          map(value => typeof value === 'string' ? value : value.url),
          map(name => name ? this._filter(name) : this.savedUrls.slice())
        );
    });
  }

  private _filter(value: string): SavedUrl[] {
    const filterValue = value.toLowerCase();

    return this.savedUrls.filter(savedUrl => savedUrl.url.toLowerCase().includes(filterValue));
  }

  ngOnDestroy(): void {
    this.contentService.keywords.unsubscribe();
    this.contentService.content.unsubscribe();
  }

  displayUrl(savedUrl?: SavedUrl) {
    return savedUrl ? typeof savedUrl === 'string' ? savedUrl : savedUrl.url : undefined;
  }

  processUrl() {
    this.addUrlTrailingSlash();
    this.urlService.urlToRetrieveContent.next(this.url);
  }

  saveUrl() {
    if (this.content.length < 1) {
      throw new Error('Content must not be empty!');
    }

    const body = this.prepareSaveRequestBody();
    if (typeof this.url === 'string') {
      this.addUrlTrailingSlash();
      body.url = this.url;
      this.performSaveUrlRequest(body, 'Saved successfully!');
    } else {
      this.openOverwriteDialog(body);
    }
  }

  openOverwriteDialog(requestBody: any): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        title: 'Overwrite',
        question: 'Do you want to overwrite saved page?'
      }
    });
    requestBody.url = (this.url as SavedUrl).url;
    requestBody.pageIdToOverwrite = (this.url as SavedUrl).id;
    dialogRef.afterClosed().subscribe(successAction => {
      if (successAction) {
        this.performSaveUrlRequest(requestBody, 'Overwritten successfully!');
      }
    });
  }

  performSaveUrlRequest(body: any, successMessage: string) {
    this.http.post('/api/save_url', JSON.stringify(body), HttpHeader.JSON_HEADER)
      .subscribe(
        ignored => {
          this.fetchSavedUrls();
          this.toastrService.success(successMessage);
        });
  }

  prepareSaveRequestBody(): any {
    const parsedTags = [];
    this.content.forEach(unit => parsedTags.push({
      tag: unit.insideTag,
      text: unit.text
    }));
    const targetKeywords = [];
    this.keywordsData.filter(keyword => keyword.isTarget).forEach(keyword => {
      targetKeywords.push({
        keyword: keyword.keyword.toLowerCase()
      });
    });
    const ignoredKeywords = [];
    this.keywordsData.filter(keyword => keyword.isIgnored).forEach(keyword => {
      ignoredKeywords.push({
        keyword: keyword.keyword.toLowerCase()
      });
    });
    return {
      ignored: ignoredKeywords,
      target: targetKeywords,
      content: parsedTags
    };
  }

  fetchSavedUrls(callback?) {
    this.http.get<SavedUrl[]>('/api/retrieve_urls', HttpHeader.JSON_HEADER)
      .subscribe(
        res => {
          this.savedUrls.splice(0, this.savedUrls.length);
          res.forEach(savedUrl => this.savedUrls.push(savedUrl));
          if (callback) {
            callback();
          }
        }
      );
  }

  addUrlTrailingSlash() {
    if (typeof this.url === 'string' && this.url.charAt(this.url.length - 1) !== '/') {
      this.url += '/';
    }
  }

  openDeleteDialog(): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        title: 'Delete',
        question: 'Do you want to delete saved page?'
      }
    });

    dialogRef.afterClosed().subscribe(successAction => {
      if (successAction) {
        this.deleteSavedPage();
      }
    });
  }

  deleteSavedPage() {
    this.http.delete('/api/delete_saved_page?id=' + (this.url as SavedUrl).id, HttpHeader.JSON_HEADER)
      .subscribe(
        res => {
          this.toastrService.success('Page successfully deleted!');
          this.fetchSavedUrls(() => this.url = (this.url as SavedUrl).url);
        }
      );
  }

  isUrlPageExists(): boolean {
    return this.url && typeof this.url !== 'string';
  }

  private get toastrService(): ToastrService {
    return this.injector.get(ToastrService);
  }
}
