municipalityApp.component('panelBudgetUploadComponent', {
    templateUrl: './tpl/pages/budget/upload.html',
    controller: [
        '$q',
        '$element',
        '$rootScope',
        '$state',
        '$scope',
        '$timeout',
        'DataUploadService',
        'CredentialsService',
        'DataStorageService',
        'ProgressFakerService',
        'ChildEstimationService',
        function(
            $q,
            $element,
            $rootScope,
            $state,
            $scope,
            $timeout,
            DataUploadService,
            CredentialsService,
            DataStorageService,
            ProgressFakerService,
            ChildEstimationService
        ) {
            var ctrl = this;
            var circle = false;
            var csvParser = false;

            var makeCircle = function() {
                return new ProgressBar.Circle($('#progress')[0], {
                    color: '#FFEA82',
                    trailColor: '#eee',
                    trailWidth: 1,
                    duration: 1400,
                    easing: 'bounce',
                    strokeWidth: 5,
                    from: {
                        color: '#70c567',
                        a: 0
                    },
                    to: {
                        color: '#70c567',
                        a: 1
                    },
                    // Set default step function for all animate calls
                    step: function(state, circle) {
                        circle.path.setAttribute('stroke', state.color);
                    }
                });
            }

            var resetProgress = function() {
                setProgress(0);
            }

            var setProgress = function(value) {
                circle.set(value / 100);
            }

            var animateProgress = function(value) {
                circle.animate(value / 100, 50);
            }

            var bind = function() {
                csvParser.selectFile = function(e) {
                    e && (e.preventDefault() & e.stopPropagation());

                    var input = $('<input type="file" accept=".csv"/>');

                    input.bind('change', function(e) {
                        var target_file = this.files[0];

                        new $q(function(resolve, reject) {
                            Papa.parse(target_file, {
                                complete: resolve
                            });
                        }).then(function(results) {
                            var header = results.data[0];

                            var budgetPos = header.indexOf('BETAALD CRED');
                            var bsnPos = header.indexOf('NR. PERS');

                            var data = results.data.slice(1);

                            csvParser.data = {};

                            data.forEach(function(row, key) {
                                var count_childs = ChildEstimationService
                                    .estimateChildsByBudget(
                                        parseFloat(row[budgetPos])
                                    )[0].toString();

                                csvParser.data[key] = {
                                    id: key,
                                    count_childs: count_childs,
                                    nr_pers: row[bsnPos]
                                };
                            });

                            csvParser.csvFile = target_file;
                            csvParser.progress = 2;
                        }, console.log);
                    }).click();
                };

                csvParser.uploadToServer = function(e) {
                    e && (e.preventDefault() & e.stopPropagation());

                    csvParser.progress = 3;

                    var submitData = {};

                    Object.values(csvParser.data).forEach(function(row) {
                        if (row.count_childs < 1)
                            return;

                        submitData[row.id] = {
                            id: row.id,
                            count_childs: row.count_childs,
                        };
                    })

                    DataUploadService.submitData(
                        submitData
                    ).then(function(response) {
                        ProgressFakerService.make(1000).on('progress', function(progress) {
                            $timeout(function() {
                                animateProgress(progress);
                                csvParser.progressBar = progress;
                            }, 0);
                        }).on('end', function(progress) {
                            $timeout(function() {
                                animateProgress(100);
                                csvParser.progressBar = 100;
                                csvParser.progress = 4;

                                csvParser.serverData = csvParser.responseDataToCsv(response.data.response);

                                DataStorageService.writeItem(
                                    'uploaded_budget', JSON.stringify({
                                        rows: csvParser.serverData,
                                        file: {
                                            name: csvParser.csvFile.name,
                                            type: csvParser.csvFile.type,
                                        }
                                    })
                                );

                                $scope.$emit('budget:uploaded', init);
                            }, 0);
                        });
                    });
                }

                csvParser.responseDataToCsv = function(data) {
                    var csvContent = [];

                    csvContent[0] = ['NR PERS', 'COUNT CHILDS', 'CODE'];

                    for (var prop in data) {
                        var id = parseInt(prop);

                        csvContent.push([
                            csvParser.data[id].nr_pers,
                            csvParser.data[id].count_childs,
                            data[id].code,
                        ]);
                    }

                    return csvContent;
                }

                csvParser.saveFromServer = function(e) {
                    e && (e.preventDefault() & e.stopPropagation());

                    var file = csvParser.csvFile;
                    var file_name = file.name.replace('.csv', '') + '-final.csv';
                    var file_type = file.type + ';charset=utf-8;';
                    var file_data = Papa.unparse(csvParser.serverData);

                    var blob = new Blob([file_data], {
                        type: file_type,
                    });

                    saveAs(blob, file_name);
                };
            };

            var init = function() {
                csvParser.progress = 1;

                bind();

                ctrl.csvParser = csvParser;
            };

            circle = makeCircle();
            csvParser = {};

            init();
        }
    ]
});