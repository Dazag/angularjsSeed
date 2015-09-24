module App.User {

    interface IUser {
        name:string;
        surname:string;
        email:string;
    }

    export class Service extends App.services.Rest {

        static $inject = ['$http', '$q', 'appConfig', '$rootScope', '$window'];
        private static _propertyName = 'userInfo';

        user:IUser;
        window:ng.IWindowService;
        rootScope:ng.IRootScopeService;

        constructor($http:ng.IHttpService, $q:ng.IQService, appConfig:App.services.IAppConfig, $rootScope:ng.IRootScopeService, $window:ng.IWindowService) {
            super($http, $q, appConfig);

            this.rootScope = $rootScope;
            this.window = $window;

            if (this.window.sessionStorage[Service._propertyName]) {
                this.user = JSON.parse(this.window.sessionStorage[Service._propertyName]);
            }
            else if (this.window.localStorage[Service._propertyName]) {
                this.user = JSON.parse(this.window.localStorage[Service._propertyName]);
            }
        }

        login(identity:string, password:string, remember:boolean):ng.IPromise<string> {
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
            delete this.window.sessionStorage[Service._propertyName];
            delete this.window.localStorage[Service._propertyName];
            this.user = null;

            this.rootScope.$broadcast('logout');
        }

        save(permanent:boolean):void {
            if (angular.isUndefined(permanent)) {
                permanent = !!this.window.localStorage[Service._propertyName];
            }

            this.window[permanent ? 'localStorage' : 'sessionStorage'][Service._propertyName] = JSON.stringify(this.user);
        }
    }

    App.Bootstrap.app.service('UserService', App.User.Service);
       /* .config(['$httpProvider', function ($httpProvider) {
            $httpProvider.interceptors.push(['$q', '$auth', function ($q, $auth) {
                return {
                    request: function authHttpInterceptorRequest(httpConfig) {
                        var token = $auth.user ? $auth.user.token : false;
                        if (token) {
                            httpConfig.headers.Authorization = 'Bearer ' + token;
                        }
                        return httpConfig;
                    },
                    responseError: function authHttpInterceptorResponse(response) {
                        if (response.status === 401) {//Sesión expirada
                            $auth.logout();
                        }
                        return $q.reject(response);
                    }
                };
            }]);
        }]);*/
}
