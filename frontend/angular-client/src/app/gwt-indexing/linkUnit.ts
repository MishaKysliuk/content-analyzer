export class LinkUnit {
    url: string;
    status: string;
    message: string;

    constructor(url, status, message) {
      this.url = url;
      this.status = status;
      this.message = message;
    }
}
