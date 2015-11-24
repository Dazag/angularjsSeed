module project.User {

    export class UserCtrl {

        static $inject = ['UserSrv', 'AuthSrv'];

        User:project.User.UserSrv;
        Auth:project.services.AuthSrv;

        loginForm:project.User.ILoginForm;
        signupForm:project.User.ISignupForm;


        constructor(UserSrv:project.User.UserSrv, AuthSrv:project.services.AuthSrv) {
            this.User = UserSrv;
            this.Auth = AuthSrv;
        }

        login(form:ILoginForm) {
            this.Auth.login(form.email, form.password, form.remember);
        }

        signup(form:project.User.ISignupForm) {
            this.Auth.errorMessage = '';
            this.Auth.satellizerAuth.signup({email: form.email, password: form.password});
        }
    }
}
project.Bootstrap.angular.controller('UserCtrl', project.User.UserCtrl);