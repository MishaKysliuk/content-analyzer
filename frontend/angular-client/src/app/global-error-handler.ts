import {ErrorHandler, Inject, Injectable, Injector} from '@angular/core';
import {ToastrService} from 'ngx-toastr';

@Injectable()
export class GlobalErrorHandler extends ErrorHandler {

  constructor(@Inject(Injector) private readonly injector: Injector) {
    super();
  }

  handleError(error) {
    console.log('inside');
    this.toastrService.error(error.message, 'Error', { onActivateTick: true });
  }

  /**
   * Need to get ToastrService from injector rather than constructor injection to avoid cyclic dependency error
   */
  private get toastrService(): ToastrService {
    return this.injector.get(ToastrService);
  }

}
