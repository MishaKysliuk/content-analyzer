import {Component, OnInit} from '@angular/core';
import { NgForm } from '@angular/forms';
import {ContentUnit} from './contentUnit';
import { Router } from '@angular/router';

@Component({
  selector: 'app-content-table',
  templateUrl: './content-table.component.html',
  styleUrls: ['./content-table.component.css']
})
export class ContentTableComponent implements OnInit {

  content: ContentUnit[] = [
    {
      insideTag: 'h1',
      text: window.location.href,
      isEditable: false
    },
    {
      insideTag: 'h1',
      text: 'Zalypa asnfdjasflansdfkljalsdnjklajsd askdj p;kasjd;kasjd;kjas d;kjasd;k ja;ksdj ;kajsd ;kjasd as' +
        'kdjajsd;kasjd; ja;ksdj;kasjd;kajsd;k jas;kdja;ksjd ;kasjd ;kjasd ;kja dj;as j',
      isEditable: false
    },
    {
      insideTag: 'h1',
      text: 'Zalypa asnfdjasflansdfkljalsdnjklajsd askdj p;kasjd;kasjd;kjas d;kjasd;k ja;ksdj ;kajsd ;kjasd as' +
        'kdjajsd;kasjd; ja;ksdj;kasjd;kajsd;k jas;kdja;ksjd ;kasjd ;kjasd ;kja dj;as j',
      isEditable: false
    }
  ];

  constructor() {
  }

  ngOnInit() {
  }

  addContentUnit() {
    this.content.push({
      insideTag: '',
      text: '',
      isEditable: true
    });
  }

  deleteContentUnit(index) {
    this.content.splice(index, 1);
  }

  editContentUnit(index) {
    this.content[index].isEditable = !this.content[index].isEditable;
  }
}
