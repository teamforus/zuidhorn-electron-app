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
        'FormBuilderService',
        'ProgressFakerService',
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
            FormBuilderService,
            ProgressFakerService
        ) {
            var ctrl = this;
            var circle = false;
            var csvParser = false;
            var input;

            ctrl.uploadSingle = false;

            ctrl.singleRecord = {
                form: FormBuilderService.build().fillValues({
                    'nr_pers': '',
                    'count_kids': 1
                }, ['nr_pers', 'count_kids']),
                uploaded: false
            };

            ctrl.uploadSingleShow = function(e) {
                e.preventDefault();
                e.stopPropagation();

                ctrl.uploadSingle = true;
            };

            ctrl.uploadSingleCancel = function(e) {
                e.preventDefault();
                e.stopPropagation();

                ctrl.singleRecord.form.reset();
                ctrl.uploadSingle = false;
            };

            var validateSingle = function(values) {
                var errors = {};
                
                if (
                    (typeof values.count_kids == 'undefined') || 
                    (!values.count_kids) || 
                    (isNaN(parseInt(values.count_kids))) ||
                    (parseInt(values.count_kids) < 1) 
                ) {
                    errors.count_kids = [
                        "Count kids field is required, should be number and more thant 0."
                    ];
                }

                if (
                    (typeof values.nr_pers != 'string') || 
                    (!values.nr_pers) || 
                    (values.nr_pers.length < 5) 
                ) {
                    errors.nr_pers = [
                        "Nr Pers field is required and should have at least 5 character."
                    ];
                }

                return errors;
            };

            ctrl.uploadSingleSubmit = function(e) {
                e.preventDefault();
                e.stopPropagation();

                var validationErrors = validateSingle(ctrl.singleRecord.form.values);
                
                if (Object.keys(validationErrors).length > 0) {
                    return ctrl.singleRecord.form.fillErrors(validationErrors);
                }

                if (ctrl.singleRecord.form.is_locked) {
                    return;
                }

                ctrl.singleRecord.form.lock();

                DataUploadService.submitData([{
                    id: 1,
                    count_childs: ctrl.singleRecord.form.values.count_kids
                }]).then(function(res) {
                    var rows = [
                        ["NR PERS", "KINDEREN", "CODE"],
                        [
                            ctrl.singleRecord.form.values.nr_pers,
                            res.data.response[0].count_childs,
                            res.data.response[0].code
                        ]
                    ];

                    console.log(rows);

                    if (!DataStorageService.hasItem('uploaded_budget')) {
                        var row = [

                        ];
                        var uploaded_budget = {
                            rows: rows,
                            file: {
                                name: "data.csv",
                                type: "text/csv",
                            }
                        };
                    } else {
                        var uploaded_budget = JSON.parse(
                            DataStorageService
                            .readItem('uploaded_budget')
                        );

                        uploaded_budget.rows = rows
                            .concat(uploaded_budget.rows.slice(1));
                    }

                    DataStorageService.writeItem(
                        'uploaded_budget', JSON.stringify(uploaded_budget)
                    );
                    
                    $timeout(function() {
                        ctrl.singleRecord.uploaded = false;
                        ctrl.singleRecord.form.unlock();
                    }, 1000);
                    
                    ctrl.singleRecord.form.reset();
                    ctrl.singleRecord.uploaded = true;

                    $scope.$emit('budget:uploaded', init);
                }, function(res) {
                    console.log(res.data);
                    alert('Something went wrong.');
                });
            };

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

                            var kidsPos = header.indexOf('KINDEREN');
                            var bsnPos = header.indexOf('NR PERS');
                            var codePost = header.indexOf('CODE');

                            if (codePost !== -1)
                                return alert(
                                    "You are trying to upload .csv file " +
                                    "which already contain voucher " +
                                    "activation code. To import this " +
                                    "file please use button below.");

                            if (kidsPos == -1 || bsnPos == -1)
                                return alert(
                                    "'KINDEREN' and 'NR PERS' headers " + 
                                    "required!");

                            var data = results.data.slice(1);

                            csvParser.data = {};

                            data.forEach(function(row, key) {
                                csvParser.data[key] = {
                                    id: key,
                                    count_childs: row[kidsPos],
                                    nr_pers: row[bsnPos]
                                };
                            });

                            csvParser.csvFile = target_file;
                            csvParser.progress = 2;
                        }, console.log);
                    });

                    input.click();
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

                                var uploaded_budget;

                                if (!DataStorageService.hasItem('uploaded_budget')) {
                                    var uploaded_budget = {
                                        rows: csvParser.serverData,
                                        file: {
                                            name: csvParser.csvFile.name,
                                            type: csvParser.csvFile.type,
                                        }
                                    };
                                } else {
                                    var uploaded_budget = JSON.parse(
                                        DataStorageService
                                        .readItem('uploaded_budget')
                                    );

                                    uploaded_budget.rows = csvParser.serverData
                                        .concat(uploaded_budget.rows.slice(1));
                                }

                                DataStorageService.writeItem(
                                    'uploaded_budget', JSON.stringify(uploaded_budget)
                                );

                                $scope.$emit('budget:uploaded', init);
                            }, 0);
                        });
                    });
                }

                csvParser.responseDataToCsv = function(data) {
                    var csvContent = [];

                    csvContent[0] = ['NR PERS', 'KINDEREN', 'CODE'];

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