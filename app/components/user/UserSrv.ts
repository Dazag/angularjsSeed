module dashboard.User {

    export interface ILoginForm {
        remember:boolean;
        password:string;
        email:string;
    }

    export class UserSrv extends dashboard.services.RestSrv {

        static $inject = ['$http', '$q', 'appConfig', '$rootScope', '$window', 'AuthSrv'];

        window:ng.IWindowService;
        rootScope:ng.IRootScopeService;
        AuthSrv:dashboard.services.AuthSrv;

        constructor($http:ng.IHttpService, $q:ng.IQService, appConfig:dashboard.services.IAppConfig, $rootScope:ng.IRootScopeService, $window:ng.IWindowService, AuthSrv:dashboard.services.AuthSrv) {
            super($http, $q, appConfig);

            this.rootScope = $rootScope;
            this.window = $window;
            this.AuthSrv = AuthSrv;
        }

        login(form:ILoginForm) {
            this.AuthSrv.login(form.email, form.password, form.remember);
        }

        logout() {
            this.AuthSrv.logout();
        }
    }
}
dashboard.Bootstrap.angular.service('UserSrv', dashboard.User.UserSrv);
