import { Component, OnInit } from '@angular/core';
import {UrlService} from '../url.service';

@Component({
  selector: 'app-header-url',
  templateUrl: './header-url.component.html',
  styleUrls: ['./header-url.component.css']
})
export class HeaderUrlComponent implements OnInit {

  private url: string;

  constructor(private urlService: UrlService) { }

  ngOnInit() {
  }


  processUrl() {
    this.urlService.urlToRetrieveContent.next(this.url);
  }
}
