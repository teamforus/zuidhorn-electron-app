municipalityApp.service('BudgetService', [
    '$http',
    '$q',
    'ApiRequest',
    function(
        $http,
        $q,
        ApiRequest
    ) {
        return new(function() {
            this.getBudget = function() {
                return ApiRequest.get('/budget');
            };

            this.updateBudget = function(values) {
                var values = JSON.parse(JSON.stringify(values));

                values._method = 'PUT';

                return ApiRequest.post('/budget', values);
            };
        });
    }
]);