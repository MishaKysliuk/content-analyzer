import {Component, OnInit, ViewChild} from '@angular/core';
import {KeywordUnit} from '../../gwt-table/keywordUnit';
import {MatSort, MatTableDataSource} from '@angular/material';
import {SelectionModel} from '@angular/cdk/collections';

@Component({
  selector: 'app-keywords-table',
  templateUrl: './keywords-table.component.html',
  styleUrls: ['./keywords-table.component.css']
})
export class KeywordsTableComponent implements OnInit {

  selection: SelectionModel<KeywordUnit>;
  keywordsData: KeywordUnit[];
  @ViewChild(MatSort) sort: MatSort;

  dataSource: MatTableDataSource<KeywordUnit>;
  lastSelected = 0;
  displayedColumns: string[] = ['keyword', 'position', 'clicks'];

  constructor() {}

  ngOnInit() {
    this.keywordsData = [];
    this.selection = new SelectionModel<KeywordUnit>(true, []);
    this.dataSource = new MatTableDataSource<KeywordUnit>(this.keywordsData);
    this.dataSource.sort = this.sort;

    this.dataSource.filterPredicate = (data: KeywordUnit, filter) =>
      data.keyword.indexOf(filter) !== -1;

    this.dataSource.connect().subscribe(renderedData => {
      this.keywordsData = renderedData;
    });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  clickHandler(event, row, index) {
    if (event.shiftKey) {
      this.selectRowsFill(row, index);
    } else {
      this.selectElement(row, index);
    }
  }

  private selectRowsFill(row, index) {
    const indexA = this.lastSelected;
    const indexB = index;
    if (indexA > indexB) {
      this.selectRowsBetween(indexB, indexA);
    } else {
      this.selectRowsBetween(indexA, indexB);
    }
  }

  private selectRowsBetween(start, end) {
    for (let i = start; i <= end; i++) {
      this.selection.select(this.keywordsData[i]);
    }
  }

  private selectElement(row, index) {
    this.lastSelected = index;
    this.selection.toggle(row);
  }

  public refreshDataSource() {
    this.dataSource.data = this.keywordsData;
  }

}
