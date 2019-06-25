import { Component, OnInit } from '@angular/core';
import { LinkUnit } from './linkUnit';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {HttpHeader} from "../http.interceptor";

@Component({
  selector: 'app-gwt-indexing',
  templateUrl: './gwt-indexing.component.html',
  styleUrls: ['./gwt-indexing.component.css']
})
export class GwtIndexingComponent implements OnInit {

  public links: LinkUnit[];

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.links = [];
  }

  addLink() {
    this.links.push(new LinkUnit('', '', ''));
  }

  deleteLink(index) {
    this.links.splice(index, 1);
  }

  indexUrls() {
    let linksToIndex = this.links.map(link => {
      link.url = this.addUrlTrailingSlash(link.url);
      return link.url;
    });
    const body = {
      links: linksToIndex
    };
    this.http.post<LinkUnit[]>('/api/index_pages', JSON.stringify(body), HttpHeader.JSON_HEADER)
      .subscribe(
        res => {
          res.forEach(resp => {
            let currentLink = this.links.find(element => element.url === resp.url);
            currentLink.status = +resp.status === 200 ? 'OK' : 'ERROR';
            currentLink.message = resp.message;
          });
        }
      );
  }

  addUrlTrailingSlash(url) {
    if (url.charAt(url.length - 1) !== '/') {
      url += '/';
    }
    return url;
  }

}
