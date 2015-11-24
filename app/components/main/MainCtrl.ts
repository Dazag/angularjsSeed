module project.components {

    export class MainCtrl {

        static $inject:string[] = ['UserSrv','AlertSrv','AuthSrv'];

        User:project.User.UserSrv;
        Alert:project.Alert.AlertSrv;
        Auth:project.services.AuthSrv;

        date:Date = new Date();

        currentUser;

        constructor(UserSrv:project.User.UserSrv,AlertSrv:project.Alert.AlertSrv,AuthSrv:project.services.AuthSrv) {
            this.User = UserSrv;
            this.Alert = AlertSrv;
            this.Auth = AuthSrv;

            this.User.current().success((response)=>{
                this.currentUser = response.data;
            });
        }
    }
}

project.Bootstrap.angular.controller('MainCtrl', project.components.MainCtrl);