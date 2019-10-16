import {PhraseUnit} from './analysis-table/phraseUnit';
import {SecondTableUnit} from './secondTableUnit';


export class ServerResponse {
  wordsCount: number;
  analyzedResult: PhraseUnit[][];
  competitorsTable: SecondTableUnit[];
}
