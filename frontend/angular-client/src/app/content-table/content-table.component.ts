import {Component, OnDestroy, OnInit} from '@angular/core';
import {ContentUnit} from './contentUnit';
import {UrlService} from '../url.service';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-content-table',
  templateUrl: './content-table.component.html',
  styleUrls: ['./content-table.component.css']
})
export class ContentTableComponent implements OnInit, OnDestroy {

  public content: ContentUnit[] = [
    {
      insideTag: 'h1',
      text: window.location.href,
      isEditable: false
    },
    {
      insideTag: 'h1',
      text: 'Zalypa asnfdjasflansdfkljalsdnjklajsd askdj p;kasjd;kasjd;kjas d;kjasd;k ja;ksdj ;kajsd ;kjasd as' +
        'kdjajsd;kasjd; ja;ksdj;kasjd;kajsd;k jas;kdja;ksjd ;kasjd ;kjasd ;kja dj;as j',
      isEditable: false
    },
    {
      insideTag: 'h1',
      text: 'Zalypa asnfdjasflansdfkljalsdnjklajsd askdj p;kasjd;kasjd;kjas d;kjasd;k ja;ksdj ;kajsd ;kjasd as' +
        'kdjajsd;kasjd; ja;ksdj;kasjd;kajsd;k jas;kdja;ksjd ;kasjd ;kjasd ;kja dj;as j',
      isEditable: false
    }
  ];

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
    const urlToSend = window.location;
    console.log('url ' + urlToSend);
    this.http.post(urlToSend + '/api/retrieve_content', {
      urlToParse: url
    })
      .subscribe(
        res => {
          res.forEach(contentUnit => {

          })
        },
        err => {
          alert(err);
        }
      );
    console.log('stub ' + url);
  }

  addContentUnit() {
    this.content.push({
      insideTag: '',
      text: '',
      isEditable: true
    });
  }

  deleteContentUnit(index) {
    this.content.splice(index, 1);
  }

  editContentUnit(index) {
    this.content[index].isEditable = !this.content[index].isEditable;
  }
}
