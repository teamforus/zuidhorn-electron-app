municipalityApp.directive('pagination', [
    '$state',
    '$timeout',
    function(
        $state,
        $timeout
    ) {
        return {
            restrict: 'A',
            templateUrl: './tpl/directives/pagination.html',
            replace: true,
            transclude: true,
            scope: {
                paginator: '='
            },
            link: function($scope, iElm, iAttrs, controller) {}
        };
    }
]);