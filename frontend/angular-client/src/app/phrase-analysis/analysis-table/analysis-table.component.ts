import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {MatSort, MatTableDataSource} from '@angular/material';
import {PhraseUnit} from './phraseUnit';

@Component({
  selector: 'app-analysis-table',
  templateUrl: './analysis-table.component.html',
  styleUrls: ['./analysis-table.component.css']
})
export class AnalysisTableComponent implements OnInit {

  private _keywordsData: PhraseUnit[];
  @ViewChild(MatSort) sort: MatSort;

  dataSource: MatTableDataSource<PhraseUnit>;
  displayedColumns: string[] = ['keyword', 'inTargetCount', 'inTextCount', 'percent'];

  constructor() {
    this.dataSource = new MatTableDataSource<PhraseUnit>(this._keywordsData);
  }

  ngOnInit() {
    this.dataSource.sort = this.sort;

    this.dataSource.filterPredicate = (data: PhraseUnit, filter) =>
      data.keyword.indexOf(filter) !== -1;
  }

  get keywordsData(): PhraseUnit[] {
    return this._keywordsData;
  }

  @Input()
  set keywordsData(keywordsData: PhraseUnit[]) {
    this._keywordsData = keywordsData;
    this.dataSource.data = this._keywordsData;
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
