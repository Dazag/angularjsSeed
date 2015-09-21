/// <reference path="../imports.ts" />
'use strict';
angular.module('App', ['configFile']).config(['$stateProvider', '$urlRouterProvider', states]);
function states($stateProvider, $urlRouterProvider) {
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/playlists');
    $stateProvider.state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/menu.html',
        controller: 'AppController as AppCtrl'
    });
}
// Vendor
/// <reference path="scripts/typings/angularjs/angular.d.ts" />
/// <reference path="scripts/typings/angular-ui-router/angular-ui-router.d.ts" />
/// App
/// <reference path="app/App.ts" />
// Models
// Interfaces
// Controllers
// Directives
// Services
// Other
//# sourceMappingURL=main.js.map