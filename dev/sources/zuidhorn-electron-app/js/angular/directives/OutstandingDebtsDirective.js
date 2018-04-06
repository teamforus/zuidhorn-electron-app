municipalityApp.directive('outstandingDebts', [
    '$state',
    '$timeout',
    'AuthService',
    'ChartService',
    'EarningsService',
    'CredentialsService',
    function(
        $state,
        $timeout,
        AuthService,
        ChartService,
        EarningsService,
        CredentialsService
    ) {
        return {
            restrict: 'A',
            templateUrl: './tpl/directives/outstanding-debts.html',
            replace: true,
            transclude: true,
            link: function($scope, iElm, iAttrs, controller) {
                $scope.showChart = false;
                $scope.chartLib = ChartService.make();
                $scope.showChartButton = function() {
                    $scope.showChart = !$scope.showChart;
                }

                EarningsService.shopkeepers.list().then(function(res) {
                    $scope.shopkeepers = res.data;

                    var shopkeepersToChart = function(type, collection) {
                        $scope.chartLib.addChart('myChart_' + type, collection.map(function(shopkeeper) {
                            return {
                                label: shopkeeper.name,
                                value: shopkeeper.earnings[type]
                            };
                        }));
                    };

                    shopkeepersToChart('debs', $scope.shopkeepers);
                });
            }
        };
    }
]);