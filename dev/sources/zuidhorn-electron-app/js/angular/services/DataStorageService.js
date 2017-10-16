municipalityApp.service('DataStorageService', [
    '$http',
    'ApiRequest',
    function(
        $http,
        ApiRequest
    ) {
        return new(function() {
            var storage = {};

            this.hasItem = function(key) {
                return localStorage.getItem(key) != null;
                
                return this;
            };

            this.writeItem = function(key, value) {
                localStorage.setItem(key, value);
                
                return this;
            };

            this.readItem = function(key) {
                return localStorage.getItem(key);
            };

            this.deleteItem = function(key) {
                localStorage.removeItem(key);
                
                return this;
            };

            this.clearAll = function() {
                localStorage.clear();
                
                return this;
            };
        });
    }
]);