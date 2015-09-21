/// <reference path="../imports.ts" />

'use strict';

angular.module('App', ['configFile'])
    .config(['$stateProvider', '$urlRouterProvider', states]);


function states($stateProvider:ng.ui.IStateProvider, $urlRouterProvider:ng.ui.IUrlRouterProvider) {

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/playlists');

    $stateProvider
        .state('app', {
            url: '/app',
            abstract: true,
            templateUrl: 'templates/menu.html',
            controller: 'AppController as AppCtrl'
        });
}