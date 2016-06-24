

angular.module('appRoutes', [])


.config(function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/home');

    $stateProvider

    // HOME STATES AND NESTED VIEWS ========================================
    .state('home', {
        url: '/home',
        template: 'hello'
    })


    // ABOUT PAGE AND MULTIPLE NAMED VIEWS =================================
    .state('nerd', {
        url: '/nerd',
        templateUrl: "./nerd.html"

    });

}); // closes $routerApp.config()