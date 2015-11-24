module project.Test{

    export class TestCtrl{

        static $inject:string[] = ['UserSrv'];

        User:project.User.UserSrv;

        response:any;

        constructor(UserSrv:project.User.UserSrv){
            this.User = UserSrv;

            this.User.getAll();
        }
    }
}
