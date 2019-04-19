export class KeywordUnit {

  keyword: string;
  isTarget: boolean;
  isIgnored: boolean;
  position: number;
  clicks: number;
  impressions: number;
  inText: number;
  where: string[];

  constructor(keyword: string, position: number, clicks: number, impressions: number, inText: number, where: string[]) {
    this.keyword = keyword;
    this.position = position;
    this.clicks = clicks;
    this.impressions = impressions;
    this.inText = inText;
    this.where = where;
    this.isIgnored = false;
    this.isTarget = false;
  }

}
