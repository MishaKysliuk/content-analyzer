export class SecondTableUnit {

  keyword: string;
  inTargetCount: number;
  inTextCount: number;
  percent: number;
  where: string

  constructor(keyword: string, inTargetCount: number, inTextCount: number, percent: number, where: string) {
    this.keyword = keyword;
    this.inTargetCount = inTargetCount;
    this.inTextCount = inTextCount;
    this.percent = percent;
    this.where = where;
  }

}
