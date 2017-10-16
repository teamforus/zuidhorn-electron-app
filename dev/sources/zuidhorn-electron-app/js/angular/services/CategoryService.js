municipalityApp.service('CategoryService', [
    '$http',
    '$q',
    'ApiRequest',
    function(
        $http,
        $q,
        ApiRequest
    ) {
        return {
            list: function() {
                return ApiRequest.get('/categories');
            }
        };
    }
]);