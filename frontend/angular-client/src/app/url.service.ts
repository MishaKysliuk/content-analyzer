import {Subject} from 'rxjs';

export class UrlService {

  urlToRetrieveContent = new Subject();

  isGwtFetchEnabled = new Subject();
}
