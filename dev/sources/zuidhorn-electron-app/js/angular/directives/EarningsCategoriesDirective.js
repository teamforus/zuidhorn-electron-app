municipalityApp.directive('earningsCategories', [
    '$state',
    '$timeout',
    'AuthService',
    'EarningsService',
    'CredentialsService',
    function(
        $state,
        $timeout,
        AuthService,
        EarningsService,
        CredentialsService
    ) {
        return {
            restrict: 'A',
            templateUrl: './tpl/directives/earnings-categories.html',
            replace: true,
            transclude: true,
            link: function($scope, iElm, iAttrs, controller) {
                EarningsService.categories.list().then(function(res) {
                    $scope.categories = res.data;
                });
            }
        };
    }
]);