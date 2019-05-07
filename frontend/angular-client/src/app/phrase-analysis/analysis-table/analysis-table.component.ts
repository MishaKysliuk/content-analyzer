import {AfterContentInit, Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatSort, MatTableDataSource} from '@angular/material';
import {PhraseUnit} from './phraseUnit';
import {ContentAnalyzerService} from '../../contentAnalyzer.service';

@Component({
  selector: 'app-analysis-table',
  templateUrl: './analysis-table.component.html',
  styleUrls: ['./analysis-table.component.css']
})
export class AnalysisTableComponent implements OnInit, OnDestroy {

  @Input() keywordsData: PhraseUnit[];
  @ViewChild(MatSort) sort: MatSort;

  dataSource: MatTableDataSource<PhraseUnit>;
  displayedColumns: string[] = ['keyword', 'inTargetCount', 'inTextCount', 'percent'];

  constructor(private contentAnalyzerService: ContentAnalyzerService) { }

  ngOnInit() {
    this.dataSource = new MatTableDataSource<PhraseUnit>(this.keywordsData);
    this.dataSource.sort = this.sort;

    this.dataSource.filterPredicate = (data: PhraseUnit, filter) =>
      data.keyword.indexOf(filter) !== -1;

    this.contentAnalyzerService.contentFetched.subscribe(() => {
      this.dataSource.data = this.keywordsData;
    });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngOnDestroy(): void {
    this.contentAnalyzerService.contentFetched.unsubscribe();
  }

}
