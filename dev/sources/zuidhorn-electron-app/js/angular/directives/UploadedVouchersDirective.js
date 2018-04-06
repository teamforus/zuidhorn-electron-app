municipalityApp.directive('uploadedVouchers', [
    '$q',
    '$state',
    '$filter',
    '$timeout',
    'AuthService',
    'BudgetService',
    'PaginatorService',
    'CredentialsService',
    'DataStorageService',
    'DataUploadService',
    function(
        $q,
        $state,
        $filter,
        $timeout,
        AuthService,
        BudgetService,
        PaginatorService,
        CredentialsService,
        DataStorageService,
        DataUploadService
    ) {
        return {
            restrict: 'A',
            templateUrl: './tpl/directives/uploaded-vouchers.html',
            replace: true,
            transclude: true,
            link: function($scope, iElm, iAttrs, controller) {
                $scope.activated = [];

                var init = function() {
                    $scope.csv_content = {
                        show: false
                    };

                    $scope.importList = function(e) {
                        e && (e.preventDefault() & e.stopPropagation());

                        input = document.createElement('input');
                        input.setAttribute("type", "file");

                        input.addEventListener('change', function(e) {
                            var target_file = this.files[0];

                            new $q(function(resolve, reject) {
                                Papa.parse(target_file, {
                                    complete: resolve
                                });
                            }).then(function(results) {
                                var header = results.data[0];

                                var bsnPos = header.indexOf('NR PERS');
                                var kidsPos = header.indexOf('KINDEREN');
                                var codePos = header.indexOf('CODE');

                                // validate .csv file
                                if (bsnPos != 0 || kidsPos != 1 || codePos != 2 || header.length != 3) {
                                    return alert(
                                        "'NR PERS', 'KINDEREN' and 'CODE' " + 
                                        "headers required!");
                                }

                                if (!DataStorageService.hasItem('uploaded_budget')) {
                                    var uploaded_budget = {
                                        rows: results.data,
                                        file: {
                                            name: target_file.name,
                                            type: target_file.type,
                                        }
                                    };
                                    
                                    console.log(DataStorageService.hasItem('uploaded_budget'));
                                    console.log(uploaded_budget);
                                } else {
                                    var uploaded_budget = JSON.parse(
                                        DataStorageService
                                        .readItem('uploaded_budget')
                                    );

                                    console.log(DataStorageService
                                        .readItem('uploaded_budget'));

                                    uploaded_budget.rows = results.data.concat(
                                        uploaded_budget.rows.slice(1));

                                    console.log(bsnPos, kidsPos, codePos);
                                }

                                DataStorageService.writeItem(
                                    'uploaded_budget', JSON.stringify(uploaded_budget)
                                );

                                init();
                            }, console.log);
                        });

                        input.click();
                    }

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

                    $scope.updateActivationList = function(e) {
                        e && (e.preventDefault() & e.stopPropagation());

                        var codes = [];

                        rows.forEach(function(row) {
                            codes.push(row[2]);
                        });

                        BudgetService.checkStates(codes).then(function(response) {
                            $scope.activated = response.data;
                        }, console.log);
                    }

                    $scope.exportList = function(e) {
                        e && (e.preventDefault() & e.stopPropagation());

                        var file_name = file.name.replace('.csv', '') + '-final.csv';
                        var file_type = file.type + ';charset=utf-8;';
                        var file_data = Papa.unparse(data.rows);

                        var blob = new Blob([file_data], {
                            type: file_type,
                        });

                        saveAs(blob, file_name);
                    };

                    $scope.deleteLocalData = function(e) {
                        e && (e.preventDefault() & e.stopPropagation());

                        var confirmed = confirm(
                            "Are you sure? This action cannot be undone.");

                        if (confirmed) {
                            DataStorageService.deleteItem('uploaded_budget');
                            init();
                        }
                    };

                    $scope.addChildren = function(e, code) {
                        e.preventDefault();
                        e.stopPropagation();

                        var confirmed = confirm(
                            "Are you sure? This action cannot be undone.");

                        if (!confirmed) {
                            return;
                        }

                        DataUploadService.addChildren(code).then(function(res) {
                            data.rows = data.rows.map(function(row) {
                                if (row[2] == code) {
                                    console.log(row);
                                    row[1] = (parseInt(row[1]) + 1) + "";
                                    console.log(row);
                                }

                                return row;
                            });

                            DataStorageService.writeItem('uploaded_budget', JSON.stringify(data));
                            
                            init();
                        }, function() {
                            alert("Something went wrong.");
                        });
                    }

                    $scope.csv_content.show = true;

                    $scope.updateActivationList();
                }

                $scope.$on('budget:uploaded', init);

                init();
            }
        };
    }
]);