module App.User {

    export class Controller {

        static $inject = ['UserService'];
        UserService:App.User.Service;
        data:any;

        constructor(UserService:App.User.Service) {
            this.UserService = UserService;
        }

        login() {
            this.UserService.login('david@meetchpoint.com', 'dgme(/((', false).then((data)=>this.data = data)
        }
    }

    App.Bootstrap.app.controller('UserController', App.User.Controller);
}