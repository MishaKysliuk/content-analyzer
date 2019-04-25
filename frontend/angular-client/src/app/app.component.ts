import {Component} from '@angular/core';
import {HTTPStatus} from './http.interceptor';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Content Analyzer';
  HTTPActivity: boolean;

  constructor(private httpStatus: HTTPStatus) {
    this.httpStatus.getHttpStatus().subscribe((status: boolean) => {
      this.HTTPActivity = status;
    });
  }
}
