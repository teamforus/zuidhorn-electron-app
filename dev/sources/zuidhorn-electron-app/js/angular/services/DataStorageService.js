municipalityApp.service('DataStorageService', [
    '$http',
    'ApiRequest',
    function(
        $http,
        ApiRequest
    ) {
        return new(function() {
            var storage = localStorage;
            
            if (typeof require != 'undefined')
                storage = dataStorage;
            
            this.hasItem = function(key) {
                return storage.getItem(key) != null;
                
                return this;
            };

            this.writeItem = function(key, value) {
                storage.setItem(key, value);
                
                return this;
            };

            this.readItem = function(key) {
                return storage.getItem(key);
            };

            this.deleteItem = function(key) {
                storage.removeItem(key);
                
                return this;
            };

            this.clearAll = function() {
                storage.clear();
                
                return this;
            };
        });
    }
]);