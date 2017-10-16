municipalityApp.service('VoucherService', [
    '$http',
    'DeviceIdService',
    'ApiRequest',
    function(
        $http,
        DeviceIdService,
        ApiRequest
    ) {
        return new(function() {
            this.checkCode = function(code) {
                return ApiRequest.get('/vouchers/' + code);
            };

            this.makeTransaction = function(code, values) {
                var values = JSON.parse(JSON.stringify(values));

                values._method = 'PUT';
                
                return ApiRequest.post('/vouchers/' + code, values);
            };
        });
    }
]);