municipalityApp.directive('financialOverview', [
    '$state',
    '$timeout',
    'AuthService',
    'CredentialsService',
    function(
        $state,
        $timeout,
        AuthService,
        CredentialsService
    ) {
        return {
            restrict: 'A',
            templateUrl: './tpl/directives/financial-overview.html',
            replace: true,
            transclude: true,
            link: function($scope, iElm, iAttrs, controller) {
                $scope.active_tab = null;
            }
        };
    }
]);