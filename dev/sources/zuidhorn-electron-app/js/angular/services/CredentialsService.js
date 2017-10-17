municipalityApp.service('CredentialsService', [function() {
    return new(function() {
        this.set = function(credentails) {
            return localStorage.setItem(env_data.credentials_key, JSON.stringify(credentails));
        };

        this.get = function() {
            return JSON.parse(localStorage.getItem(env_data.credentials_key));
        };
    });
}]);