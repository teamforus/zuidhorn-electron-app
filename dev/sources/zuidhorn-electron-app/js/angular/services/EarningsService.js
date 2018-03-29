municipalityApp.service('EarningsService', [
    '$http',
    '$q',
    'ApiRequest',
    function(
        $http,
        $q,
        ApiRequest
    ) {
        return {
            shopkeepers: {
                list: function() {
                    return ApiRequest.get('/earnings/shop-keepers');
                }
            },
            categories: {
                list: function() {
                    return ApiRequest.get('/earnings/categories');
                }
            }
        };
    }
]);