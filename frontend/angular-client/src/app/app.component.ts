import {Component} from '@angular/core';
import {HTTPStatus} from './http-status.interceptor';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'angular-client';
  HTTPActivity: boolean;

  constructor(private httpStatus: HTTPStatus) {
    this.httpStatus.getHttpStatus().subscribe((status: boolean) => {
      this.HTTPActivity = status;
    });
  }
}
