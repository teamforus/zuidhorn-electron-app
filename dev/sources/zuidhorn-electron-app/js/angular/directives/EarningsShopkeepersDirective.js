municipalityApp.directive('earningsShopkeepers', [
    '$state',
    '$filter',
    '$timeout',
    'AuthService',
    'EarningsService',
    'CredentialsService',
    function(
        $state,
        $filter,
        $timeout,
        AuthService,
        EarningsService,
        CredentialsService
    ) {
        return {
            restrict: 'A',
            templateUrl: './tpl/directives/earnings-shopkeepers.html',
            replace: true,
            transclude: true,
            link: function($scope, iElm, iAttrs, controller) {
                EarningsService.shopkeepers.list().then(function(res) {
                    $scope.shopkeepers = res.data.map(function(shopKeeper) {
                        shopKeeper.transactions = shopKeeper.transactions.map(function(transaction) {
                            transaction.status = $filter('uc_first')(transaction.status);
                            transaction.created_at = $filter('pretty_date')(transaction.created_at);

                            return transaction;
                        });

                        return shopKeeper;
                    });
                });
            }
        };
    }
]);