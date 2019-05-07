export class PhraseUnit {

  keyword: string;
  inTargetCount: number;
  inTextCount: number;
  percent: number;

  constructor(keyword: string, inTargetCount: number, inTextCount: number, percent: number) {
    this.keyword = keyword;
    this.inTargetCount = inTargetCount;
    this.inTextCount = inTextCount;
    this.percent = percent;
  }

}
