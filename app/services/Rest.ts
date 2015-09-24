module App.services {

    export interface IAppConfig {
        env:string;
        apiUrl:string;
        apiVersion:string;
    }

    export class Rest {

        http:ng.IHttpService;
        q:ng.IQService;
        appConfig:IAppConfig;

        private _apiUrl:string;

        static $inject = ['$rootScope', '$http', '$q', '$window', 'appConfig'];

        constructor($http:ng.IHttpService, $q:ng.IQService, appConfig:IAppConfig) {
            this.q = $q;
            this.http = $http;
            this.appConfig = appConfig;
            this._apiUrl = appConfig.apiUrl + appConfig.apiVersion
        }

        get(endpoint:string, config:ng.IRequestShortcutConfig):ng.IHttpPromise<any> {
            return this.http.get(this._apiUrl + endpoint, config);
        }

        post(endpoint:string, object:any, config:ng.IRequestShortcutConfig = {}):ng.IHttpPromise<any> {
            return this.http.post(this._apiUrl + endpoint, object, config);
        }
    }

    App.Bootstrap.app.service('Rest', App.services.Rest);
}
