import {Injectable} from 'angular2/core';

declare var SwaggerClient: any;

@Injectable()
export class MagentoService {
  baseUrl = 'http://m2.rocwang.me/';
  swagger;
  api;

  getSwaggerClient(): Promise<any> {
    if (!this.swagger) {
      this.swagger = new SwaggerClient({
        url       : this.baseUrl + 'rest/default/schema',
        usePromise: true,
      });

      this.swagger.then(api => {
        console.log('API loaded');
        this.api = api;
      });
    }

    return this.swagger;
  }
}
