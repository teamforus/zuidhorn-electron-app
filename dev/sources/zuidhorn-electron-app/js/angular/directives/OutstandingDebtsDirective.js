municipalityApp.directive('outstandingDebts', [
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
            templateUrl: './tpl/directives/outstanding-debts.html',
            replace: true,
            transclude: true,
            link: function($scope, iElm, iAttrs, controller) {
                EarningsService.shopkeepers.list().then(function(res) {
                    $scope.shopkeepers = res.data;
                });
            }
        };
    }
]);