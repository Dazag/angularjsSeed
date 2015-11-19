module project.components {

    export class MainCtrl {

        static $inject:string[] = ['UserSrv','AlertSrv'];

        User:project.User.UserSrv;
        Alert:project.Alert.AlertSrv;

        date:Date = new Date();

        currentUser;

        constructor(UserSrv:project.User.UserSrv,AlertSrv:project.Alert.AlertSrv) {
            this.User = UserSrv;
            this.Alert = AlertSrv;

            this.User.current().success((response)=>{
                this.currentUser = response.data;
            });
        }
    }
}

project.Bootstrap.angular.controller('MainCtrl', project.components.MainCtrl);