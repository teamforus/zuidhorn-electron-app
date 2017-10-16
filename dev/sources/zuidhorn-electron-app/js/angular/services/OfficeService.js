municipalityApp.service('OfficeService', [
    '$http',
    'ApiRequest',
    function(
        $http,
        ApiRequest
    ) {
        return new(function() {
            this.list = function() {
                return ApiRequest.get('/offices');
            };

            this.find = function(id) {
                return ApiRequest.get('/offices/' + id);
            };
        });
    }
]);