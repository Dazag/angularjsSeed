module project.User {

    export class UserCtrl {

        static $inject = ['UserSrv', 'AuthSrv'];

        User:project.User.UserSrv;
        Auth:project.services.AuthSrv;

        loginForm:project.User.ILoginForm;
        signupForm:project.User.ISignupForm;
        appSettings:project.IAppConfig;


        constructor(UserSrv:project.User.UserSrv, AuthSrv:project.services.AuthSrv) {
            this.User = UserSrv;
            this.Auth = AuthSrv;
            this.appSettings = Bootstrap.appSettings;
        }

        login(loginForm:project.User.ILoginForm) {
            this.Auth.login(loginForm);
        }

        signup(signupForm:project.User.ISignupForm) {
            this.Auth.signup(signupForm);
        }
    }
}
project.Bootstrap.angular.controller('UserCtrl', project.User.UserCtrl);