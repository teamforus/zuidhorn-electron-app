municipalityApp.directive('earningsShopkeepers', [
    '$state',
    '$filter',
    '$timeout',
    'AuthService',
    'ChartService',
    'EarningsService',
    'CredentialsService',
    function(
        $state,
        $filter,
        $timeout,
        AuthService,
        ChartService,
        EarningsService,
        CredentialsService
    ) {
        return {
            restrict: 'A',
            templateUrl: './tpl/directives/earnings-shopkeepers.html',
            replace: true,
            transclude: true,
            link: function($scope, iElm, iAttrs, controller) {
                $scope.showChart = false;
                $scope.chartLib = ChartService.make();
                $scope.showChartButton = function() {
                    $scope.showChart = !$scope.showChart;
                }

                $scope.states = {
                    pending: "In behandeling", 
                    refunded: "Terugbetaald", 
                    success: "Voltooid"
                };

                EarningsService.shopkeepers.list().then(function(res) {
                    $scope.shopkeepers = res.data.map(function(shopKeeper) {
                        shopKeeper.transactions = shopKeeper.transactions.map(function(transaction) {
                            transaction.created_at = $filter('pretty_date')(transaction.created_at);

                            return transaction;
                        });

                        return shopKeeper;
                    });

                    var shopkeepersToChart = function(type, collection) {
                        $scope.chartLib.addChart('myChart_' + type, collection.map(function(shopkeeper) {
                            return {
                                label: shopkeeper.name,
                                value: shopkeeper.earnings[type]
                            };
                        }));
                    };

                    shopkeepersToChart('total', $scope.shopkeepers);
                    shopkeepersToChart('last_week', $scope.shopkeepers);
                    shopkeepersToChart('last_month', $scope.shopkeepers);
                });
            }
        };
    }
]);