import {Component, OnDestroy, OnInit} from '@angular/core';
import {PhraseUnit} from './analysis-table/phraseUnit';
import {ContentService} from '../content.service';
import {ContentUnit} from '../content-table/contentUnit';
import {KeywordUnit} from '../gwt-table/keywordUnit';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ServerResponse} from './serverResponse';
import {HttpHeader} from "../http.interceptor";

@Component({
  selector: 'app-phrase-analysis',
  templateUrl: './phrase-analysis.component.html',
  styleUrls: ['./phrase-analysis.component.css']
})
export class PhraseAnalysisComponent implements OnInit, OnDestroy {

  selectedDivider: number;
  dividers: number[];
  dividerArray: number[];
  analyzedData: PhraseUnit[][];
  wordsCount: number;
  keywordsData: KeywordUnit[];
  content: ContentUnit[];
  isAnalyzerFetchEnabled: boolean;

  constructor(private http: HttpClient, private contentService: ContentService) { }

  ngOnInit() {
    this.isAnalyzerFetchEnabled = false;
    this.dividers = [1, 2, 3, 4, 5, 6];
    this.contentService.content.subscribe((content: ContentUnit[]) => {
      this.content = content;
    });
    this.contentService.keywords.subscribe((keywordsData: KeywordUnit[]) => {
      this.keywordsData = keywordsData;
    });
    this.contentService.isTargetKeywordsPresent.subscribe( (isTargetKeywordPresent: boolean) => {
      this.isAnalyzerFetchEnabled = isTargetKeywordPresent;
    });
  }

  ngOnDestroy(): void {
    this.contentService.keywords.unsubscribe();
    this.contentService.content.unsubscribe();
    this.contentService.isTargetKeywordsPresent.unsubscribe();
  }

  fetchAnalyzedData() {
    const parsedTags = [];
    this.content.forEach(unit => parsedTags.push({
      tag: unit.insideTag,
      text: unit.text
    }));
    const targetKeywords = [];
    this.keywordsData.filter(keyword => keyword.isTarget).forEach(keyword => {
      targetKeywords.push({
        keyword: keyword.keyword
      });
    });
    const body = {
      divideCount: this.selectedDivider,
      keywords: targetKeywords,
      content: parsedTags
    };
    this.http.post<ServerResponse>('/api/retrieve_analysis', JSON.stringify(body), HttpHeader.JSON_HEADER)
      .subscribe(
        res => {
          this.wordsCount = res.wordsCount;
          this.analyzedData = res.analyzedResult;
          this.dividerArray = Array.from(Array(this.selectedDivider), (x, i) => i);
        }
      );
  }

}
