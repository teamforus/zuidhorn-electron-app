municipalityApp.service('ShopKeeperService', [
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
                return ApiRequest.get('/shop-keepers');
            },
            find: function(id) {
                return ApiRequest.get('/shop-keepers/' + id);
            },
            listOffices: function(id, values) {
                return ApiRequest.get('/shop-keepers/' + id + '/offices');
            },
            availableStates: function(id) {
                return [{
                    name: 'pending',
                    value: 'Pending'
                }, {
                    name: 'declined',
                    value: 'Declined'
                }, {
                    name: 'approved',
                    value: 'Approved'
                }];
            },
            setStates: function(id, state) {
                return ApiRequest.post('/shop-keepers/' + id + '/state', {
                    state: state
                });
            }
        };
    }
]);