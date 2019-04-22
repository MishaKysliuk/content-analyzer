import {Component, OnInit, ViewChild} from '@angular/core';
import {KeywordUnit} from './keywordUnit';
import {MatSort, MatTableDataSource} from '@angular/material';
import {SelectUnit} from "./selectUnit";

@Component({
  selector: 'app-gwt-table',
  templateUrl: './gwt-table.component.html',
  styleUrls: ['./gwt-table.component.css']
})
export class GwtTableComponent implements OnInit {

  keywordsData: KeywordUnit[];
  countries: SelectUnit[];
  devices: SelectUnit[];
  @ViewChild(MatSort) sort: MatSort;

  dataSource: MatTableDataSource<KeywordUnit>;
  displayedColumns: string[] = ['keyword', 'inKeyword', 'inIgnored', 'position', 'clicks', 'impressions', 'inText', 'where'];

  constructor() {
  }

  ngOnInit() {
    this.keywordsData = [];
    this.keywordsData.push(new KeywordUnit('casino online paypal', 2, 111, 123, 4, 'p'));
    this.keywordsData.push(new KeywordUnit('casino online paypal play', 2, 11155, 1232, 4, 'h1'));
    this.dataSource = new MatTableDataSource<KeywordUnit>(this.keywordsData);
    this.dataSource.sort = this.sort;

    this.dataSource.filterPredicate = (data: KeywordUnit, filter) =>
      data.keyword.indexOf(filter) !== -1;

    this.countries = this.getCountriesForFilter();
    this.devices = this.getDevicesForFilter();
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  onTargetToggle(keyword: KeywordUnit) {
    keyword.isTarget = !keyword.isTarget;
    if (keyword.isTarget === true) {
      keyword.isIgnored = false;
    }
  }

  onIgnoreToggle(keyword: KeywordUnit) {
    keyword.isIgnored = !keyword.isIgnored;
    if (keyword.isIgnored === true) {
      keyword.isTarget = false;
    }
  }

  getCountriesForFilter(): SelectUnit[] {
    const countries: SelectUnit[] = [];
    countries.push(new SelectUnit('United Arab Emirates', 'ARE'));
    countries.push(new SelectUnit('Argentina', 'ARG'));
    countries.push(new SelectUnit('Australia', 'AUS'));
    countries.push(new SelectUnit('Belgium', 'BEL'));
    countries.push(new SelectUnit('Brazil', 'BRA'));
    countries.push(new SelectUnit('Canada', 'CAN'));
    countries.push(new SelectUnit('Switzerland', 'CHE'));
    countries.push(new SelectUnit('Czech', 'CZE'));
    countries.push(new SelectUnit('Germany', 'DEU'));
    countries.push(new SelectUnit('Denmark', 'DNK'));
    countries.push(new SelectUnit('Egypt', 'EGY'));
    countries.push(new SelectUnit('Spain', 'ESP'));
    countries.push(new SelectUnit('Finland', 'FIN'));
    countries.push(new SelectUnit('France', 'FRA'));
    countries.push(new SelectUnit('United Kingdom', 'GBR'));
    countries.push(new SelectUnit('Georgia', 'GEO'));
    countries.push(new SelectUnit('Hong Kong', 'HKG'));
    countries.push(new SelectUnit('Croatia', 'HRV'));
    countries.push(new SelectUnit('Hungary', 'HUN'));
    countries.push(new SelectUnit('India', 'IND'));
    countries.push(new SelectUnit('Ireland', 'IRL'));
    countries.push(new SelectUnit('Iceland', 'ISL'));
    countries.push(new SelectUnit('Israel', 'ISR'));
    countries.push(new SelectUnit('Italy', 'ITA'));
    countries.push(new SelectUnit('Japan', 'JPN'));
    countries.push(new SelectUnit('Lithuania', 'LTU'));
    countries.push(new SelectUnit('Latvia', 'LVA'));
    countries.push(new SelectUnit('Luxembourg', 'LUX'));
    countries.push(new SelectUnit('Monaco', 'MCO'));
    countries.push(new SelectUnit('Mexico', 'MEX'));
    countries.push(new SelectUnit('Netherlands', 'NLD'));
    countries.push(new SelectUnit('Norway', 'NOR'));
    countries.push(new SelectUnit('New Zealand', 'NZL'));
    countries.push(new SelectUnit('Poland', 'POL'));
    countries.push(new SelectUnit('Portugal', 'PRT'));
    countries.push(new SelectUnit('Russia', 'RUS'));
    countries.push(new SelectUnit('Singapore', 'SGP'));
    countries.push(new SelectUnit('Slovakia', 'SVK'));
    countries.push(new SelectUnit('Slovenia', 'SVN'));
    countries.push(new SelectUnit('Sweden', 'SWE'));
    countries.push(new SelectUnit('Turkey', 'TUR'));
    countries.push(new SelectUnit('Ukraine', 'UKR'));
    countries.push(new SelectUnit('United States', 'USA'));

    countries.sort((a, b) => (a.label > b.label) ? 1 : ((b.label > a.label) ? -1 : 0));

    return countries;
  }

  getDevicesForFilter(): SelectUnit[] {
    const devices: SelectUnit[] = [];
    devices.push(new SelectUnit('Desktop', 'DESKTOP'));
    devices.push(new SelectUnit('Mobile', 'MOBILE'));
    devices.push(new SelectUnit('Tablet', 'TABLET'));
    return devices;
  }

}
