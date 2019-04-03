import {Component, OnDestroy, OnInit} from '@angular/core';
import {ContentUnit} from './contentUnit';
import {UrlService} from '../url.service';
import {HttpClient} from '@angular/common/http';
import {ServerResponseUnit} from './serverResponseUnit';

@Component({
  selector: 'app-content-table',
  templateUrl: './content-table.component.html',
  styleUrls: ['./content-table.component.css']
})
export class ContentTableComponent implements OnInit, OnDestroy {

  public content: ContentUnit[] = [];

  constructor(private urlService: UrlService, private http: HttpClient) {
  }

  ngOnInit() {
    this.urlService.urlToRetrieveContent.subscribe( (url: string) => {
      this.retrieveContentFromUrl(url);
    });
  }

  ngOnDestroy() {
    this.urlService.urlToRetrieveContent.unsubscribe();
  }

  retrieveContentFromUrl(url: string) {
    this.content = [];
    this.http.get<ServerResponseUnit[]>('/api/retrieve_content?parse=' + url)
      .subscribe(
        res => {
          res.forEach(unit => {
            this.content.push(new ContentUnit(unit.tag, unit.text, false));
          })
        },
        err => {
          alert(err.json());
        }
      );
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
