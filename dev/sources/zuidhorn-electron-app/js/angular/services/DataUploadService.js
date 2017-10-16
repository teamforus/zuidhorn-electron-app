municipalityApp.service('DataUploadService', ['ApiRequest', function(ApiRequest) {
    return new(function() {
        this.submitData = function(data) {
            return ApiRequest.post('/budget/csv', data);
        };
    });
}]);