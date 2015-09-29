module dashboard {

    export class Bootstrap {

        static angular:ng.IModule;
        static $inject:string[] = ['dashboard.config', 'ui.router'];

        static run(){
            Bootstrap.angular = angular.module('EmbApp', dashboard.Bootstrap.$inject);
            Bootstrap.angular.config(dashboard.BootstrapConfig);
        }
    }

    export class BootstrapConfig{

        static $inject:string[] = ['$stateProvider', '$urlRouterProvider'];

        constructor($stateProvider:ng.ui.IStateProvider, $urlRouterProvider:ng.ui.IUrlRouterProvider) {

            // if none of the above states are matched, use this as the fallback
            $urlRouterProvider.otherwise('/');

            $stateProvider
                .state('home', {
                    url: '/',
                    templateUrl: 'app/layout/home.html',
                })
                .state('login', {
                    url: '/login',
                    templateUrl: 'app/components/user/login.html',
                    controller: dashboard.User.UserCtrl,
                    controllerAs: 'UserCtrl'
                });
        }
    }
}

//run application
dashboard.Bootstrap.run();