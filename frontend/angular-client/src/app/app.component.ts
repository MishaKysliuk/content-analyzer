import {Component, OnInit, NgZone, OnDestroy} from '@angular/core';
import {HTTPStatus} from './http.interceptor';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy{
  title = 'Content Analyzer';
  HTTPActivity: boolean;
  indexing: boolean;

  constructor(private httpStatus: HTTPStatus, private zone: NgZone) {
    this.httpStatus.getHttpStatus().subscribe((status: boolean) => {
      this.HTTPActivity = status;
    });
  }

  public setPageToIndexing(isIndexing) {
    console.log(isIndexing);
    this.zone.run(() => this.indexing = isIndexing);
  }

  ngOnInit(): void {
    (<any>window).setPageToIndexing = this.setPageToIndexing.bind(this);
  }

  ngOnDestroy() {
    (<any>window).setPageToIndexing = null;
  }

}
