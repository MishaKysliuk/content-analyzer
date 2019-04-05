import {Component, OnInit} from '@angular/core';
import {KeywordUnit} from './keywordUnit';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-ignored-keywords',
  templateUrl: './ignored-keywords.component.html',
  styleUrls: ['./ignored-keywords.component.css']
})


export class IgnoredKeywordsComponent implements OnInit {

  public keywords: KeywordUnit[] = [];


  constructor() {
  }

  ngOnInit() {
    this.keywords.push(new KeywordUnit('Casino', 100));
    this.keywords.push(new KeywordUnit('Casino games', 1000));
    this.keywords.push(new KeywordUnit('Casino online', 110));
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.keywords, event.previousIndex, event.currentIndex);
  }

}
