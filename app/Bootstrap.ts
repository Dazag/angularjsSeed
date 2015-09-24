module App {
    'use strict';

    export class Bootstrap {

        static $inject:string[] = ['$stateProvider', '$urlRouterProvider'];
        static app:ng.IModule = angular.module('App', ['App.config', 'ui.router']);

        stateProvider:ng.ui.IStateProvider;
        urlRouterProvider:ng.ui.IUrlRouterProvider;


        constructor($stateProvider:ng.ui.IStateProvider, $urlRouterProvider:ng.ui.IUrlRouterProvider) {
            this.stateProvider = $stateProvider;
            this.urlRouterProvider = $urlRouterProvider;

            this._config();
        }

        private _config() {

            // if none of the above states are matched, use this as the fallback
            this.urlRouterProvider.otherwise('/');

            this.stateProvider
                .state('home', {
                    url: '/',
                    templateUrl: 'app/layout/home.html',
                })
                .state('login', {
                    url: '/login',
                    templateUrl: 'app/components/user/login.html',
                    controller: App.User.Controller,
                    controllerAs: 'UserCtrl'
                });
        }
    }

    App.Bootstrap.app.config(['$stateProvider', '$urlRouterProvider',
        ($stateProvider, $urlRouterProvider, appConfig)=>new Bootstrap($stateProvider, $urlRouterProvider)])

}
