import { Component, OnInit, OnDestroy, Inject, Injector } from '@angular/core';
import {HttpHeader} from "../http.interceptor";
import {ToastrService} from 'ngx-toastr';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-links-checker',
  templateUrl: './links-checker.component.html',
  styleUrls: ['./links-checker.component.css']
})
export class LinksCheckerComponent implements OnInit, OnDestroy {

  sheetId: string;

  constructor(private http: HttpClient, @Inject(Injector) private readonly injector: Injector) { }

  ngOnInit() {
    (<any>window).checkLinks = this.checkLinks.bind(this);
  }

  ngOnDestroy() {
    (<any>window).checkLinks = null;
  }

  checkLinks() {
    const body = {
      sheetId: this.sheetId
    };
    this.http.post('/api/check_links', JSON.stringify(body), HttpHeader.JSON_HEADER)
        .subscribe(
          res => {
            if (res['requiresAuth']) {
              const width = window.screen.availWidth * 40 / 100;
              const height = window.screen.availHeight * 60 / 100;
              window.open(res['authLink'], 'Google Login', `height=${height},width=${width}`);
            } else {
              this.toastrService.success("Links are checked successfully!");
            }
          }
        );
  }

  private get toastrService(): ToastrService {
    return this.injector.get(ToastrService);
  }

}
