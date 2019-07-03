import {Component, OnDestroy, OnInit, Inject, Injector, NgZone} from '@angular/core';
import {PhraseUnit} from './analysis-table/phraseUnit';
import {ContentService} from '../content.service';
import {ContentUnit} from '../content-table/contentUnit';
import {KeywordUnit} from '../gwt-table/keywordUnit';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ToastrService} from 'ngx-toastr';
import {ServerResponse} from './serverResponse';
import {HttpHeader, HTTPStatus} from "../http.interceptor";
declare const gapi: any;

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
  isGapiSignedIn: boolean;
  isGapiInited: boolean;

  constructor(private http: HttpClient, private contentService: ContentService, 
    @Inject(Injector) private readonly injector: Injector, private zone: NgZone) { }

  ngOnInit() {
    this.isGapiSignedIn = false;
    this.isGapiInited = false;
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
    (<any>window).initGapiClient = this.initGapiClient.bind(this);
  }

  ngOnDestroy(): void {
    this.contentService.keywords.unsubscribe();
    this.contentService.content.unsubscribe();
    this.contentService.isTargetKeywordsPresent.unsubscribe();
    (<any>window).initGapiClient = null;
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

  initGapiClient() {
    gapi.client.init({
      clientId: '806809737555-ilqho4qgcl6gterthfv78lt8h4vau4qk.apps.googleusercontent.com',
      scope: 'https://www.googleapis.com/auth/drive.file',
      discoveryDocs: ["https://sheets.googleapis.com/$discovery/rest?version=v4"]
    }).then(() => {
      gapi.auth2.getAuthInstance().isSignedIn.listen((isSignedIn) => this.updateSigninStatus(isSignedIn));
      this.updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
      this.zone.run(() => this.isGapiInited = true);
    }, error => {
      this.zone.run(() =>
        this.toastrService.error('Could not init Google Spreadsheets. Please reload page. Remember to use *.xip.io hostname.')
      );
    });
  }

  updateSigninStatus(isSignedIn) {
    this.zone.run(() => {
      this.isGapiSignedIn = isSignedIn;
    });
  }

  exportData() {
    if (this.isGapiSignedIn) {
      this.createSpreadsheetAndExport();
    } else {
      gapi.auth2.getAuthInstance().signIn().then(() => {
        this.createSpreadsheetAndExport();
      });
    }
  }

  createSpreadsheetAndExport() {
    this.httpStatus.setHttpStatus(true);
    const title = 'Keywords-' + new Date().toLocaleString();
    gapi.client.sheets.spreadsheets.create({
      properties: {
        title: title
      }
    }).then((response) => {
      this.exportToSpreadsheets(response.result.spreadsheetId, title);
    });
    
  }

  exportToSpreadsheets(spreadsheetId: string, title: string) {
    let resultData = this.getExportedKeywordsData();
    if (this.analyzedData) {
      const analyzedValues = this.getExportedAnalyzedData(resultData[0]['values'].length + 2);
      resultData = resultData.concat(analyzedValues);
    }
    
    const body = {
      data: resultData,
      valueInputOption: 'USER_ENTERED'
    };

    gapi.client.sheets.spreadsheets.values.batchUpdate({
      spreadsheetId: spreadsheetId,
      resource: body
    }).then((response) => {
      this.zone.run(() => {
        this.httpStatus.setHttpStatus(false);
        this.toastrService.success(`Data successfully exported to ${title}!`);
      });
    });
 }

  getExportedKeywordsData(): any[] {
    let values = [['Keywords', 'Position', 'Clicks', 'Impressions', 'InText', 'Where', 'IsTarget', 'IsIgnored']];
    this.keywordsData.forEach((keyword: KeywordUnit) => values.push([keyword.keyword, keyword.position.toFixed(2), keyword.clicks.toFixed(2), 
      keyword.impressions.toFixed(2), keyword.inText.toFixed(), keyword.where, keyword.isTarget.toString(), keyword.isIgnored.toString()]));
    return [{
      range: `A1:H${values.length}`,
      values: values
    }];
  }

  getExportedAnalyzedData(startRow: number): any[] {
    const ranges = [['A', 'D'], ['F', 'I'], ['K', 'N'], ['P', 'S'], ['U', 'X'], ['Z', 'AC']];
    const result = [];

    for(let i = 0; i < this.analyzedData.length; i++) {
      if (this.analyzedData[i].length > 0) {
        let values = [['Keyword', 'InTargetCount', 'InTextCount', 'Percent']];
        this.analyzedData[i].forEach((phraseUnit: PhraseUnit) => values.push([phraseUnit.keyword, phraseUnit.inTargetCount.toString(),
          phraseUnit.inTextCount.toString(), phraseUnit.percent.toFixed(2)]));
        result.push({
          range: `${ranges[i][0]}${startRow}:${ranges[i][1]}${startRow + values.length}`,
          values: values
        });
      }
    }
    return result;
  }


  handleSignoutClick() {
    gapi.auth2.getAuthInstance().signOut().then(() => this.toastrService.success('Logged out from Google API successfully!'));
  }

  private get toastrService(): ToastrService {
    return this.injector.get(ToastrService);
  }

  private get httpStatus(): HTTPStatus {
    return this.injector.get(HTTPStatus);
  }

}
