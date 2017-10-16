municipalityApp.directive('uploadedVouchers', [
    '$state',
    '$filter',
    '$timeout',
    'AuthService',
    'PaginatorService',
    'CredentialsService',
    'DataStorageService',
    function(
        $state,
        $filter,
        $timeout,
        AuthService,
        PaginatorService,
        CredentialsService,
        DataStorageService
    ) {
        return {
            restrict: 'A',
            templateUrl: './tpl/directives/uploaded-vouchers.html',
            replace: true,
            transclude: true,
            link: function($scope, iElm, iAttrs, controller) {
                $scope.csv_content = {
                    show: false
                };

                var init = function() {

                    if (!DataStorageService.hasItem('uploaded_budget'))
                        return;

                    var data = JSON.parse(DataStorageService.readItem('uploaded_budget'));
                    var rows = JSON.parse(JSON.stringify(data.rows.map(function(item, key) {
                        var out = {};

                        for (var prop in item) {
                            out[prop] = item[prop];
                        }

                        return out;
                    })));

                    var headers = rows.shift();
                    var file = data.file;

                    $scope.csv_content.data = {
                        headers: headers,
                        rows: rows,
                        rows2: PaginatorService.make(rows, 10),
                    }

                    $scope.saveFromServer = function(e) {
                        e && (e.preventDefault() & e.stopPropagation());

                        var file_name = file.name.replace('.csv', '') + '-final.csv';
                        var file_type = file.type + ';charset=utf-8;';
                        var file_data = Papa.unparse(data.rows);

                        var blob = new Blob([file_data], {
                            type: file_type,
                        });

                        saveAs(blob, file_name);
                    };

                    $scope.csv_content.show = true;
                }

                $scope.$on('budget:uploaded', init);
                init();
            }
        };
    }
]);