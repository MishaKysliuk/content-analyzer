import {Component, OnInit, ViewChild} from '@angular/core';
import {KeywordUnit} from '../gwt-table/keywordUnit';
import {SelectionModel} from '@angular/cdk/collections';
import {KeywordsTableComponent} from './keywords-table/keywords-table.component';

@Component({
  selector: 'app-ignored-keywords',
  templateUrl: './ignored-keywords.component.html',
  styleUrls: ['./ignored-keywords.component.css']
})


export class IgnoredKeywordsComponent implements OnInit {

  @ViewChild('targetKeywordsComponent') targetKeywordsComponent: KeywordsTableComponent;
  @ViewChild('ignoredKeywordsComponent') ignoredKeywordsComponent: KeywordsTableComponent;

  constructor() {
  }

  ngOnInit() {

    setTimeout(() => {
      this.refreshDataSources();
    }, 2000);
  }

  moveElements(from: KeywordUnit[], to: KeywordUnit[], selection: SelectionModel<KeywordUnit>) {
    const elements = selection.selected;
    elements.forEach(element => {
      const index: number = from.findIndex(unit => unit.keyword === element.keyword);
      from.splice(index, 1);
      to.push(element);
      selection.toggle(element);
    });
  }

  moveToIgnored() {
    this.moveElements(this.targetKeywordsComponent.keywordsData,
      this.ignoredKeywordsComponent.keywordsData, this.targetKeywordsComponent.selection);
    this.refreshDataSources();
  }

  moveToTarget() {
    this.moveElements(this.ignoredKeywordsComponent.keywordsData,
      this.targetKeywordsComponent.keywordsData, this.ignoredKeywordsComponent.selection);
    this.refreshDataSources();
  }

  private refreshDataSources() {
    this.targetKeywordsComponent.refreshDataSource();
    this.ignoredKeywordsComponent.refreshDataSource();
  }

}
