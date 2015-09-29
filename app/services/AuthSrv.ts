module dashboard.services {

    export class AuthSrv extends dashboard.services.RestSrv {

        static $inject:string[] = ['$http', '$q', 'appConfig', '$rootScope', '$window'];
        private static _propertyName = 'userInfo';

        user:any;
        window:ng.IWindowService;
        rootScope:ng.IRootScopeService;

        constructor($http:ng.IHttpService, $q:ng.IQService, appConfig:dashboard.services.IAppConfig, $rootScope:ng.IRootScopeService, $window:ng.IWindowService) {
            super($http, $q, appConfig);

            this.rootScope = $rootScope;
            this.window = $window;

            if (this.window.sessionStorage[AuthSrv._propertyName]) {
                this.user = JSON.parse(this.window.sessionStorage[AuthSrv._propertyName]);
            }
            else if (this.window.localStorage[AuthSrv._propertyName]) {
                this.user = JSON.parse(this.window.localStorage[AuthSrv._propertyName]);
            }
        }

        login(identity:string, password:string, remember = false):ng.IPromise<any> {
            var deferred = this.q.defer();

            this.post('auth/login', {
                email: identity,
                password: password
            }, {
                ignoreErrors: true
            }).success(
                (data, status)=> {
                    this.user = data;
                    this.save(remember);
                    deferred.resolve(this.user);
                    this.rootScope.$broadcast('login', this.user);
                }).error(
                (error)=>deferred.reject(error.userMessage)
            );

            return deferred.promise;
        }

        logout():void {
            delete this.window.sessionStorage[AuthSrv._propertyName];
            delete this.window.localStorage[AuthSrv._propertyName];
            this.user = null;

            this.rootScope.$broadcast('logout');
        }

        save(permanent:boolean):void {
            if (angular.isUndefined(permanent)) {
                permanent = !!this.window.localStorage[AuthSrv._propertyName];
            }

            this.window[permanent ? 'localStorage' : 'sessionStorage'][AuthSrv._propertyName] = JSON.stringify(this.user);
        }
    }

    export class AuthConfig {

        static $inject:string[] = ['$httpProvider'];

        constructor($httpProvider:ng.IHttpProvider) {
            $httpProvider.interceptors.push(['$q', '$injector', function ($q, $injector) {
                return {
                    request: function (httpConfig) {
                        var $auth = $injector.get('AuthSrv');
                        var token = $auth.user ? $auth.user.token : false;
                        if (token) {
                            httpConfig.headers.Authorization = 'Bearer ' + token;
                        }
                        return httpConfig;
                    },
                    responseError: function (response) {
                        var $auth = $injector.get('AuthSrv');
                        if (response.status === 401) {//Sesión expirada
                            $auth.logout();
                        }
                        return $q.reject(response);
                    }
                };
            }]);
        }
    }
}

dashboard.Bootstrap.angular
    .service('AuthSrv', dashboard.services.AuthSrv)
    .config(['$httpProvider', dashboard.services.AuthConfig]);