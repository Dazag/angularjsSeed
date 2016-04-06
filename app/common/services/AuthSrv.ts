module project.services {

    import UserSrv = project.User.UserSrv;
    export class AuthSrv extends project.services.RestSrv {

        static $inject:string[] = ['$http', '$rootScope', '$window', '$auth'];
        private static _propertyName = 'userData';

        sessionData:any;
        window:ng.IWindowService;
        rootScope:ng.IRootScopeService;
        satellizerAuth:any;

        errorMessage:string;

        constructor($http:ng.IHttpService, $rootScope:ng.IRootScopeService, $window:ng.IWindowService, $auth:any) {
            super($http);

            this.rootScope = $rootScope;
            this.window = $window;
            this.satellizerAuth = $auth;

            if (this.window.sessionStorage[AuthSrv._propertyName]) {
                this.sessionData = JSON.parse(this.window.sessionStorage[AuthSrv._propertyName]);
            }
            else if (this.window.localStorage[AuthSrv._propertyName]) {
                this.sessionData = JSON.parse(this.window.localStorage[AuthSrv._propertyName]);
            } else {
                this.logout();
            }
        }

        /**
         * Autentica a un usuario con un proveedor de autenticación (google, facebook, twitter, etc)
         * @param provider
         */
        authenticate(provider:string):void {
            this.errorMessage = '';//clear error message

            this.satellizerAuth.authenticate(provider
            ).then((response)=> {
                this.sessionData = response.data;

                this.save(true);//por defecto inicio de sesión permanente
                this.rootScope.$broadcast('login', response.data);
            }).catch((response)=> {
                this.errorMessage = response.data.userMessage;
            });
        }

        /**
         * Petición básica de login con usuario y contraseña
         * @param form
         */
        login(form:project.User.ILoginForm):ng.IQResolveReject<any> {
            this.errorMessage = '';//clear error message

            return this.satellizerAuth.login({
                email: form.email,
                password: form.password
            }, {
                paramas: {ignoreErrors: true}
            }).then((response) => {
                this.sessionData = response.data;
                this.save(form.remember);
                this.rootScope.$broadcast('login', response.data);
            }).catch((response)=> {
                this.errorMessage = response.data.userMessage;
            });
        }

        signup(form:project.User.ISignupForm) {
            this.errorMessage = '';//clear error message

            return this.satellizerAuth.signup({
                email: form.email,
                password: form.password,
            }).then((response)=> {
                var loginForm:project.User.ILoginForm = {
                    email: form.email,
                    password: form.password, remember: false
                };

                this.login(loginForm);
            }).catch((response)=> {
                this.errorMessage = response.data.userMessage;
            });
        }

        logout():void {

            //destroy all saved data, included session info
            this.window.sessionStorage.clear();
            this.window.localStorage.clear();
            this.sessionData = null;

            this.satellizerAuth.logout();
            this.rootScope.$broadcast('logout');
        }

        /**
         * Establece inicio de sesión temporal o permanente utilizando el payload de inicio de sesión
         * @param permanent
         */
        save(permanent:boolean):void {
            this.window[permanent ? 'localStorage' : 'sessionStorage'][AuthSrv._propertyName] = JSON.stringify(this.sessionData);
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