import {Component, OnInit, ViewChild} from '@angular/core';
import {KeywordUnit} from './keywordUnit';
import {MatSort, MatTableDataSource} from '@angular/material';

@Component({
  selector: 'app-gwt-table',
  templateUrl: './gwt-table.component.html',
  styleUrls: ['./gwt-table.component.css']
})
export class GwtTableComponent implements OnInit {

  keywordsData: KeywordUnit[];
  @ViewChild(MatSort) sort: MatSort;

  dataSource: MatTableDataSource<KeywordUnit>;
  displayedColumns: string[] = ['keyword', 'inKeyword', 'inIgnored', 'position', 'clicks', 'impressions', 'inText', 'where'];

  constructor() {
  }

  ngOnInit() {
  }

}
