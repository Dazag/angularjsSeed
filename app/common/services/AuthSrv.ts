module project.services {

    export class AuthSrv extends project.services.RestSrv {

        static $inject:string[] = ['$http', 'appConfig', '$rootScope', '$window', '$auth'];
        private static _propertyName = 'userInfo';

        user:any;
        window:ng.IWindowService;
        rootScope:ng.IRootScopeService;
        satellizerAuth:any;

        errorMessage:string;

        constructor($http:ng.IHttpService, appConfig:project.IAppConfig, $rootScope:ng.IRootScopeService, $window:ng.IWindowService, $auth:any) {
            super($http, appConfig);

            this.rootScope = $rootScope;
            this.window = $window;
            this.satellizerAuth = $auth;

            if (this.window.sessionStorage[AuthSrv._propertyName]) {
                this.user = JSON.parse(this.window.sessionStorage[AuthSrv._propertyName]);
            }
            else if (this.window.localStorage[AuthSrv._propertyName]) {
                this.user = JSON.parse(this.window.localStorage[AuthSrv._propertyName]);
            }
        }

        authenticate(provider:string):void {
            this.satellizerAuth.authenticate(provider)
                .then((response)=> {
                    console.log(response);
                    this.user = response.data;
                    this.rootScope.$broadcast('login', this.user);
                })
                .catch((response)=> {
                    this.errorMessage = response.data.userMessage;
                });
        }

        login(identity:string, password:string, remember = false):void {
            this.errorMessage = '';

            this.satellizerAuth.login({
                email: identity,
                password: password
            }, {paramas: {ignoreErrors: true}}).then((response, status) => {
                this.user = response.data;
                this.rootScope.$broadcast('login', this.user);
            }).catch(
                (response)=> {
                    this.errorMessage = response.data.userMessage;
                }
            );
        }

        logout():void {
            this.satellizerAuth.logout();
            this.user = null;

            this.rootScope.$broadcast('logout');
        }

        save(permanent:boolean):void {
            if (angular.isUndefined(permanent)) {
                permanent = !!this.window.localStorage[AuthSrv._propertyName];
            }

            this.window[permanent ? 'localStorage' : 'sessionStorage'][AuthSrv._propertyName] = JSON.stringify(this.user);
        }

        static config($httpProvider:ng.IHttpProvider):void {
            $httpProvider.interceptors.push(['$q', '$injector', function ($q, $injector) {
                return {
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