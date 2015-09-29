module dashboard.User {

    export class UserCtrl {

        static $inject = ['UserSrv'];

        UserSrv:dashboard.User.UserSrv;

        data:any;
        form: dashboard.User.ILoginForm;


        constructor(UserSrv:dashboard.User.UserSrv) {
            this.UserSrv = UserSrv;
        }
    }
}
dashboard.Bootstrap.angular.controller('UserCtrl', dashboard.User.UserCtrl);