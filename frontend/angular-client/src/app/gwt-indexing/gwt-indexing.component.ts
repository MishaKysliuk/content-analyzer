import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-gwt-indexing',
  templateUrl: './gwt-indexing.component.html',
  styleUrls: ['./gwt-indexing.component.css']
})
export class GwtIndexingComponent implements OnInit {

  public links: string[];

  constructor() { }

  ngOnInit() {
    this.links = [];
  }

  addLink() {
    this.links.push('');
  }

  deleteLink(index) {
    this.links.splice(index, 1);
  }

}
