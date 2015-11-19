module project.User {

    export class UserCtrl {

        static $inject = ['UserSrv','AuthSrv'];

        User:project.User.UserSrv;
        Auth:project.services.AuthSrv;

        data:any;
        form: project.User.ILoginForm;


        constructor(UserSrv:project.User.UserSrv,AuthSrv:project.services.AuthSrv) {
            this.User = UserSrv;
            this.Auth = AuthSrv;
        }
    }
}
project.Bootstrap.angular.controller('UserCtrl', project.User.UserCtrl);