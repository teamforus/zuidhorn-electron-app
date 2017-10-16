municipalityApp.service('CredentialsService', ['ApiRequest', function(ApiRequest) {
    return new(function() {
        this.set = function(credentails) {
            return localStorage.setItem('credentails', JSON.stringify(credentails));
        };

        this.get = function() {
            return JSON.parse(localStorage.getItem('credentails'));
        };
    });
}]);