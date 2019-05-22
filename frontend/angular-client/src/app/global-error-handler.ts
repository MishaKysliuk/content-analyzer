import {ErrorHandler, Inject, Injectable, Injector} from '@angular/core';
import {ToastrService} from 'ngx-toastr';
import {HTTPStatus} from './http.interceptor';

@Injectable()
export class GlobalErrorHandler extends ErrorHandler {

  constructor(@Inject(Injector) private readonly injector: Injector) {
    super();
  }

  handleError(error) {
    this.toastrService.error(error.message, 'Error', { onActivateTick: true });
    this.httpStatus.setHttpStatus(false);
  }

  /**
   * Need to get ToastrService from injector rather than constructor injection to avoid cyclic dependency error
   */
  private get toastrService(): ToastrService {
    return this.injector.get(ToastrService);
  }

  private get httpStatus(): HTTPStatus {
    return this.injector.get(HTTPStatus);
  }

}
