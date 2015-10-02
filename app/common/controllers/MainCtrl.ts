module dashboard.common {

    export class MainCtrl {

        static $inject:string[] = ['UserSrv'];
        UserSrv:dashboard.User.UserSrv;

        constructor(UserSrv:dashboard.User.UserSrv) {
            this.UserSrv = UserSrv;
        }
    }
}

dashboard.Bootstrap.angular.controller('MainCtrl', dashboard.common.MainCtrl);