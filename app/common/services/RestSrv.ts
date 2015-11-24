module project.services {

    export class RestSrv {

        http:ng.IHttpService;
        appConfig:IAppConfig;

        private _apiUrl:string;

        static $inject = ['$http', 'appConfig'];

        constructor($http:ng.IHttpService, appConfig:IAppConfig) {
            this.http = $http;
            this.appConfig = appConfig;
            this._apiUrl = appConfig.apiUrl + appConfig.apiVersion
        }

        get(endpoint:string, params?:string, limit:number = 10, config:ng.IRequestShortcutConfig = {}):ng.IHttpPromise<any> {

            var url = this._apiUrl + endpoint + '?limit=' + limit;

            if (params) {
                //@todo hacer array en vez de string
                url = url + params;
            }

            return this.http.get(url, config).success((response)=> {
                console.log(response);
            });
        }

        getOne(id:number, endpoint:string, config:ng.IRequestShortcutConfig = {}):ng.IHttpPromise<any> {
            return this.get(endpoint + '/' + id, null, -1, config);
        }

        post(endpoint:string, object:any, config:ng.IRequestShortcutConfig = {}):ng.IHttpPromise<any> {
            return this.http.post(this._apiUrl + endpoint, object, config).success((response)=> {
                console.log(response);
            });
        }

        remove(endpoint:string, config:ng.IRequestShortcutConfig = {}):ng.IHttpPromise<any> {
            return this.http.delete(this._apiUrl + endpoint, config).success((response)=> {
                console.log(response);
            });
        }

        update(endpoint:string,object:any,config:ng.IRequestShortcutConfig = {}):ng.IHttpPromise<any>{
            return this.http.put(this._apiUrl + endpoint,object,config).success((response)=> {
                console.log(response);
            });
        }
    }
}
project.Bootstrap.angular.service('RestSrv', project.services.RestSrv);