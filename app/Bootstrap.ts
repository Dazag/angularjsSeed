module project {


    export interface IAppConfig {
        env:string;
        apiUrl:string;
        apiVersion:string;
        appName:string;
        google:{
            clientId:string,
            url: string
        };
        facebook:{
            clientId:string,
            url: string
        }
    }

    export class Bootstrap {

        static angular:ng.IModule;
        static $inject:string[] = ['project.config', 'ui.router', 'ui.bootstrap', 'satellizer'];
        static appSettings:IAppConfig;

        static start() {
            Bootstrap.angular = angular.module('EmbApp', project.Bootstrap.$inject);

            //Setting up the application
            Bootstrap.angular.config(['$stateProvider', '$urlRouterProvider', '$authProvider', 'appConfig', Bootstrap.config]);
            //Run the application
            Bootstrap.angular.run(['$rootScope', '$state', 'AuthSrv', Bootstrap.run]);
        }

        static config($stateProvider:ng.ui.IStateProvider, $urlRouterProvider:ng.ui.IUrlRouterProvider, $authProvider:any, appConfig:project.IAppConfig) {

            //we set up the settings to make appConfig global accessed
            Bootstrap.appSettings = appConfig;

            var apiURL:string = Bootstrap.appSettings.apiUrl + Bootstrap.appSettings.apiVersion;

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
                })
                .state('signup', {
                    url: '/signup',
                    templateUrl: 'app/components/user/signup.html',
                    controller: project.User.UserCtrl,
                    controllerAs: 'UserCtrl'
                });

            // if none of the above states are matched, use this as the fallback
            $urlRouterProvider.otherwise('/');

            /**
             *  Satellizer default configuration
             *
             $authProvider.httpInterceptor = function() { return true; },
             $authProvider.tokenRoot = null;
             $authProvider.cordova = false;
             $authProvider.baseUrl = '/';
             $authProvider.tokenName = 'token';
             $authProvider.tokenPrefix = 'satellizer';
             $authProvider.authHeader = 'Authorization';
             $authProvider.authToken = 'Bearer';
             $authProvider.storageType = 'localStorage';
             */
            
            $authProvider.withCredentials = false;
            $authProvider.loginUrl = apiURL + 'auth/login';
            $authProvider.signupUrl = apiURL + 'auth/signup';
            $authProvider.unlinkUrl = apiURL + 'auth/unlink/';

            $authProvider.facebook({
                clientId: Bootstrap.appSettings.facebook.clientId,
                url: apiURL + Bootstrap.appSettings.facebook.url,
            });

            $authProvider.google({
                clientId: Bootstrap.appSettings.google.clientId,
                url: apiURL + Bootstrap.appSettings.google.url,
            });
        }

        static run($rootScope:ng.IRootScopeService, $state:ng.ui.IStateService, AuthSrv:project.services.AuthSrv) {

            $rootScope.$on('login', function () {
                $state.go('home.test'); // go to login
            });

            $rootScope.$on('logout', function () {
                $state.go('login'); // go to login
            });

            $rootScope.$on('$stateChangeStart', function (e, toState/* toParams, fromState, fromParams*/) {

                if (toState.name === 'login' || toState.name === 'signup') {
                    return; // no need to redirect
                }

                if (!AuthSrv.satellizerAuth.isAuthenticated()) {
                    e.preventDefault(); // stop current execution
                    $state.go('login'); // go to login
                }
            });
        }
    }
}

//run application
project.Bootstrap.start();