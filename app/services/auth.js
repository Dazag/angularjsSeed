var app = angular.module('starter');


app.factory('$auth', ['$rootScope', '$injector', '$q', '$window', function authFactory($rootScope,$injector, $q, $window) {
    var instance = {};
    var propertyName = 'userInfo';

    instance.login = function login(identity, password, remember) {
        var deferred = $q.defer();

        var $http = $injector.get('$http');
        $http.post(API_URL + '/auth/login', {
            user: identity,
            password: password
        }, {
            ignoreErrors: true
        }).success(function loginSuccess(data) {
            instance.user = data;
            instance.save(remember);
            deferred.resolve(instance.user);

            $rootScope.$broadcast('login', instance.user);
        }).error(function loginError(data) {
            deferred.reject(data.userMessage);
        });

        return deferred.promise;
    };

    instance.logout = function logout() {
        delete $window.sessionStorage[propertyName];
        delete $window.localStorage[propertyName];
        instance.user = null;

        $rootScope.$broadcast('logout');
    };

    instance.save = function saveAuthInfo(permanent) {
        if (angular.isUndefined(permanent)) {
            permanent = !!$window.localStorage[propertyName];
        }

        $window[permanent ? 'localStorage' : 'sessionStorage'][propertyName] = JSON.stringify(instance.user);
    };

    //Inicializar
    if ($window.sessionStorage[propertyName]) {
        instance.user = JSON.parse($window.sessionStorage[propertyName]);
    } else if ($window.localStorage[propertyName]) {
        instance.user = JSON.parse($window.localStorage[propertyName]);
    }

    return instance;
}]).config(['$httpProvider', function authHttpProvider($httpProvider) {
    $httpProvider.interceptors.push(['$q', '$auth', function authHttpInterceptor($q, $auth) {
        return {
            request: function authHttpInterceptorRequest(httpConfig) {
                var token = $auth.user ? $auth.user.token : false;
                if (token) {
                    httpConfig.headers.Authorization = 'Bearer ' + token;
                }
                return httpConfig;
            },
            responseError: function authHttpInterceptorResponse(response) {
                if (response.status === 401) {//Sesión expirada
                    $auth.logout();
                }
                return $q.reject(response);
            }
        };
    }]);
}]);
