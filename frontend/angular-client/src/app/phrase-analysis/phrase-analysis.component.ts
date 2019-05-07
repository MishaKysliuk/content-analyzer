import { Component, OnInit } from '@angular/core';
import {PhraseUnit} from './analysis-table/phraseUnit';

@Component({
  selector: 'app-phrase-analysis',
  templateUrl: './phrase-analysis.component.html',
  styleUrls: ['./phrase-analysis.component.css']
})
export class PhraseAnalysisComponent implements OnInit {

  selectedDivider: number;
  dividers: number[];
  selectedWordsCount: number[];
  analyzedData: PhraseUnit[][];
  wordsCount: number;

  constructor() { }

  ngOnInit() {
    this.dividers = [1, 2, 3, 4, 5, 6];
  }


  fetchAnalyzedData() {
    this.selectedWordsCount = Array.from({length: this.selectedDivider}, (x, i) => i);
    this.analyzedData = [];
    this.wordsCount = 111;
    const ss = [];
    ss.push(new PhraseUnit('casino', 1, 2, 3));
    ss.push(new PhraseUnit('game', 1, 2, 3));
    ss.push(new PhraseUnit('online', 1, 2, 3));
    ss.push(new PhraseUnit('paypal', 1, 2, 3));
    this.analyzedData.push(ss);
    const sss = [];
    sss.push(new PhraseUnit('casino online', 1, 2, 3));
    sss.push(new PhraseUnit('casino online', 1, 2, 3));
    sss.push(new PhraseUnit('casino online', 1, 2, 3));
    this.analyzedData.push(sss);
  }

}
