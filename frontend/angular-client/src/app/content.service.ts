import {Subject} from 'rxjs';

export class ContentService {

  content = new Subject();

  keywords = new Subject();

  isTargetKeywordsPresent = new Subject();

}
