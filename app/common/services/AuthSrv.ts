module project.services {

    export class AuthSrv extends project.services.RestSrv {

        static $inject:string[] = ['$http', '$q', 'appConfig', '$rootScope', '$window'];
        private static _propertyName = 'userInfo';

        user:any;
        window:ng.IWindowService;
        rootScope:ng.IRootScopeService;
        errorMessage:string;

        constructor($http:ng.IHttpService, $q:ng.IQService, appConfig:project.services.IAppConfig, $rootScope:ng.IRootScopeService, $window:ng.IWindowService) {
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
                params: {ignoreErrors: true}
            }).success(
                (data, status)=> {
                        this.user = data;
                        this.save(remember);
                        deferred.resolve(this.user);
                        this.rootScope.$broadcast('login', this.user);
                }).error(
                (error)=> {
                    this.errorMessage = error.userMessage;
                    deferred.reject(error.userMessage)
                }
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

        isAuthenticated() {
            return typeof this.user != 'undefined' && this.user.token;
        }

        static config($httpProvider:ng.IHttpProvider) {
            $httpProvider.interceptors.push(['$q', '$injector', function ($q, $injector) {
                return {
                    request: function (httpConfig) {
                        var AuthSrv = $injector.get('AuthSrv');
                        var token = AuthSrv.user ? AuthSrv.user.token : false;
                        if (token) {
                            httpConfig.headers.Authorization = 'Bearer ' + token;
                        }
                        return httpConfig;
                    },
                    responseError: function (response) {
                        var AuthSrv = $injector.get('AuthSrv');
                        if (response.status === 401 || response.status === 403) {//Sesión expirada
                            AuthSrv.logout();
                        }
                        return $q.reject(response);
                    }
                };
            }]);
        }
    }
}

project.Bootstrap.angular
    .service('AuthSrv', project.services.AuthSrv)
    .config(['$httpProvider', project.services.AuthSrv.config]);