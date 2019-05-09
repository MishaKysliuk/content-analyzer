import {Component, Inject, Injector, OnDestroy, OnInit} from '@angular/core';
import {UrlService} from '../url.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ContentService} from '../content.service';
import {KeywordUnit} from '../gwt-table/keywordUnit';
import {ContentUnit} from '../content-table/contentUnit';
import {FormControl} from '@angular/forms';
import {Observable, of} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {SavedUrl} from './savedUrl';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-header-url',
  templateUrl: './header-url.component.html',
  styleUrls: ['./header-url.component.css']
})
export class HeaderUrlComponent implements OnInit, OnDestroy {

  myControl = new FormControl();
  public url = '';
  keywordsData: KeywordUnit[];
  content: ContentUnit[];
  savedUrls: SavedUrl[] = [];
  filteredUrls: Observable<SavedUrl[]>;

  constructor(private urlService: UrlService, private http: HttpClient, private contentService: ContentService,
              @Inject(Injector) private readonly injector: Injector) { }

  ngOnInit() {
    this.contentService.content.subscribe((content: ContentUnit[]) => {
      this.content = content;
    });
    this.contentService.keywords.subscribe((keywordsData: KeywordUnit[]) => {
      this.keywordsData = keywordsData;
    });

    this.fetchSavedUrls(() => {
      this.filteredUrls = this.myControl.valueChanges
        .pipe(
          startWith(''),
          map(value => this._filter(value))
        );
    });
    // this.filteredUrls = of(this.savedUrls);
  }

  private _filter(value: string): SavedUrl[] {
    const filterValue = value.toLowerCase();

    return this.savedUrls.filter(savedUrl => savedUrl.url.toLowerCase().includes(filterValue));
  }

  ngOnDestroy(): void {
    this.contentService.keywords.unsubscribe();
    this.contentService.content.unsubscribe();
  }

  processUrl() {
    this.addUrlTrailingSlash();
    this.urlService.urlToRetrieveContent.next(this.url);
  }

  saveUrl() {
    if (this.content.length < 1) {
      throw new Error('Content must not be empty!');
    }
    this.addUrlTrailingSlash();
    const parsedTags = [];
    this.content.forEach(unit => parsedTags.push({
      tag: unit.insideTag,
      text: unit.text
    }));
    const targetKeywords = [];
    this.keywordsData.filter(keyword => keyword.isTarget).forEach(keyword => {
      targetKeywords.push({
        keyword: keyword.keyword
      });
    });
    const ignoredKeywords = [];
    this.keywordsData.filter(keyword => keyword.isIgnored).forEach(keyword => {
      ignoredKeywords.push({
        keyword: keyword.keyword
      });
    });
    const body = {
      url: this.url,
      ignored: ignoredKeywords,
      target: targetKeywords,
      content: parsedTags
    };
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    this.http.post('/api/save_url', JSON.stringify(body), httpOptions)
      .subscribe(
          ignored => {
            this.fetchSavedUrls();
            this.toastrService.success('Saved successfully!');
          });
  }

  fetchSavedUrls(callback?) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    this.http.get<SavedUrl[]>('/api/retrieve_urls', httpOptions)
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
    if (this.url.charAt(this.url.length - 1) !== '/') {
      this.url += '/';
    }
  }

  private get toastrService(): ToastrService {
    return this.injector.get(ToastrService);
  }
}
