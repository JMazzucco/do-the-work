angular.module('appRoutes', [])

.config(function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/home');

    $stateProvider

    // HOME STATES AND NESTED VIEWS ========================================
    .state('home', {
        url: '/home',
        templateUrl: 'views/home.html',
        controller: 'MainCtrl'
    })


    // ABOUT PAGE AND MULTIPLE NAMED VIEWS =================================
    .state('nerd', {
        url: '/nerd',
        templateUrl: "views/nerd.html",
        controller: 'NerdCtrl'
    });

});