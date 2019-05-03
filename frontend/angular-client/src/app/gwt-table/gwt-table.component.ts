import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {KeywordUnit} from './keywordUnit';
import {MatSort, MatTableDataSource} from '@angular/material';
import {SelectUnit} from './selectUnit';
import {formatDate} from '@angular/common';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {UrlService} from '../url.service';
import {ContentService} from '../content.service';
import {ContentUnit} from '../content-table/contentUnit';

@Component({
  selector: 'app-gwt-table',
  templateUrl: './gwt-table.component.html',
  styleUrls: ['./gwt-table.component.css']
})
export class GwtTableComponent implements OnInit, OnDestroy {

  keywordsData: KeywordUnit[];
  content: ContentUnit[];
  countries: SelectUnit[];
  devices: SelectUnit[];
  showTypes: SelectUnit[];
  @ViewChild(MatSort) sort: MatSort;
  dateFrom: Date;
  dateTo: Date;
  selectedDevice: string;
  selectedCountry: string;
  url: string;
  isGwtFetchEnabled: boolean;

  dataSource: MatTableDataSource<KeywordUnit>;
  displayedColumns: string[] = ['keyword', 'inKeyword', 'inIgnored', 'position', 'clicks', 'impressions', 'inText', 'where'];

  constructor(private http: HttpClient, private urlService: UrlService, private contentService: ContentService) {
  }

  ngOnInit() {
    this.dateFrom = new Date();
    this.dateTo = new Date();
    this.keywordsData = [];
    // this.keywordsData.push(new KeywordUnit('casino online paypal', 2, 111, 123, 4, 'p'));
    // this.keywordsData.push(new KeywordUnit('casino online paypal play', 2, 11155, 1232, 4, 'h1'));
    this.dataSource = new MatTableDataSource<KeywordUnit>(this.keywordsData);
    this.dataSource.sort = this.sort;

    this.dataSource.filterPredicate = (data: KeywordUnit, filter) =>
      data.keyword.indexOf(filter) !== -1;

    this.countries = this.getCountriesForFilter();
    this.devices = this.getDevicesForFilter();
    this.showTypes = this.getShowTypesForFilter();

    this.urlService.urlToRetrieveContent.subscribe((url: string) => {
      this.url = url;
    });
    this.urlService.isGwtFetchEnabled.subscribe((isGwtFetchEnabled: boolean) => {
      this.isGwtFetchEnabled = isGwtFetchEnabled;
    });
    this.contentService.content.subscribe((content: ContentUnit[]) => {
      this.content = content;
    });
  }

  ngOnDestroy() {
    this.contentService.content.unsubscribe();
    this.urlService.urlToRetrieveContent.unsubscribe();
    this.urlService.isGwtFetchEnabled.unsubscribe();
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

  fetchData() {
    const parsedTags = [];
    this.content.forEach(unit => parsedTags.push({
      tag: unit.insideTag,
      text: unit.text
    }));
    const body = {
      dateFrom: this.formatDate(this.dateFrom),
      dateTo: this.formatDate(this.dateTo),
      device: this.selectedDevice,
      country: this.selectedCountry,
      url: this.url,
      content: parsedTags
    };
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    this.http.post<KeywordUnit[]>('/api/retrieve_gwt', JSON.stringify(body), httpOptions)
      .subscribe(
        res => {
          this.keywordsData = res;
          this.dataSource.data = this.keywordsData;
        }
      );
  }

  onIgnoreToggle(keyword: KeywordUnit) {
    keyword.isIgnored = !keyword.isIgnored;
    if (keyword.isIgnored === true) {
      keyword.isTarget = false;
    }
  }

  formatDate(date: Date): string {
    return formatDate(date, 'yyyy-MM-dd', 'en-US');
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
    countries.unshift(new SelectUnit('None', null));

    return countries;
  }

  getDevicesForFilter(): SelectUnit[] {
    const devices: SelectUnit[] = [];
    devices.push(new SelectUnit('None', null));
    devices.push(new SelectUnit('Desktop', 'DESKTOP'));
    devices.push(new SelectUnit('Mobile', 'MOBILE'));
    devices.push(new SelectUnit('Tablet', 'TABLET'));
    return devices;
  }

  getShowTypesForFilter(): SelectUnit[] {
    const showTypes: SelectUnit[] = [];
    showTypes.push(new SelectUnit('Show All', 'ALL'));
    showTypes.push(new SelectUnit('Show Target', 'TARGET'));
    showTypes.push(new SelectUnit('Show Ignored', 'IGNORED'));
    showTypes.push(new SelectUnit('Show Undefined', 'UNDEFINED'));
    return showTypes;
  }

}
