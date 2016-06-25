angular.module('NerdCtrl', []).controller('NerdCtrl', ['$scope', 'Nerd', function($scope, Nerd) {

    $scope.tagline = 'Nothing beats a pocket protector!';
        $scope.test = Nerd.posts;
}]);