module dashboard.User {

    export interface IUser {
        name:string;
        email:string;
    }

    export interface ILoginForm {
        remember:boolean;
        password:string;
        email:string;
    }

    export class UserSrv extends dashboard.services.RestSrv {

        static $inject = ['$http', '$q', 'appConfig', '$rootScope', '$window', 'AuthSrv'];
        private static _propertyName = 'userInfo';

        user:IUser;
        window:ng.IWindowService;
        rootScope:ng.IRootScopeService;
        AuthSrv:dashboard.services.AuthSrv;

        constructor($http:ng.IHttpService, $q:ng.IQService, appConfig:dashboard.services.IAppConfig, $rootScope:ng.IRootScopeService, $window:ng.IWindowService, AuthSrv:dashboard.services.AuthSrv) {
            super($http, $q, appConfig);

            this.rootScope = $rootScope;
            this.window = $window;
            this.AuthSrv = AuthSrv;

            if (this.window.sessionStorage[UserSrv._propertyName]) {
                this.user = JSON.parse(this.window.sessionStorage[UserSrv._propertyName]);
            }
            else if (this.window.localStorage[UserSrv._propertyName]) {
                this.user = JSON.parse(this.window.localStorage[UserSrv._propertyName]);
            }
        }

        login(form:ILoginForm) {
            this.AuthSrv.login(form.email, form.password, form.remember).then((data)=>console.log(data))
        }


    }
}
dashboard.Bootstrap.angular.service('UserSrv', dashboard.User.UserSrv);
