module project {

    export class Bootstrap {

        static angular:ng.IModule;
        static $inject:string[] = ['project.config', 'ui.router', 'ui.bootstrap'];

        static start() {
            Bootstrap.angular = angular.module('EmbApp', project.Bootstrap.$inject);
            Bootstrap.angular.config(['$stateProvider', '$urlRouterProvider', Bootstrap.config]);
            Bootstrap.angular.run(['$rootScope', '$state', 'AuthSrv', Bootstrap.run]);
        }

        static config($stateProvider:ng.ui.IStateProvider, $urlRouterProvider:ng.ui.IUrlRouterProvider) {

            // if none of the above states are matched, use this as the fallback
            $urlRouterProvider.otherwise('/');

            $stateProvider
                .state('home', {
                    url: '/',
                    templateUrl: 'app/components/main/main.html',
                    controller: project.components.MainCtrl,
                    controllerAs: 'MainCtrl'
                })
                .state('home.test', {
                    url: 'test',
                    templateUrl: 'app/components/test/test.html',
                    controller: project.Test.TestCtrl,
                    controllerAs: 'TestCtrl'
                })
                .state('login', {
                    url: '/login',
                    templateUrl: 'app/components/user/login.html',
                    controller: project.User.UserCtrl,
                    controllerAs: 'UserCtrl'
                });
        }

        static run($rootScope:ng.IRootScopeService, $state:ng.ui.IStateService, AuthSrv:project.services.AuthSrv) {

            $rootScope.$on('login',function(){
                $state.go('home.test'); // go to login
            });

            $rootScope.$on('logout',function(){
                $state.go('login'); // go to login
            });

            $rootScope.$on("$stateChangeStart", function (e, toState/* toParams, fromState, fromParams*/) {

                if(toState.name === 'login'){
                    return; // no need to redirect
                }

                if(!AuthSrv.isAuthenticated()) {
                    e.preventDefault(); // stop current execution
                    $state.go('login'); // go to login
                }
            });
        }
    }
}

//run application
project.Bootstrap.start();