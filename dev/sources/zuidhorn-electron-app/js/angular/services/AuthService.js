municipalityApp.service('AuthService', [
    'ApiRequest',
    'CredentialsService',
    function(
        ApiRequest,
        CredentialsService
    ) {
        return new(function() {
            apiRequest = ApiRequest;

            this.signIn = function(values) {
                // return ApiRequest.get('/asd', values);
                values.grant_type = 'password';
                values.client_id = 2;
                values.client_secret = 'DKbwNT3Afz8bovp0BXvJX5jWudIRRW9VZPbzieVJ';

                return ApiRequest.post('/../oauth/token', values);
            };

            this.signOut = function(values) {
                CredentialsService.set(null);
            };

            this.getUser = function(credentails) {
                return ApiRequest.get('/user');
            };

            this.fundsAvailable = function() {
                return ApiRequest.get('/user/funds');
            };
        });
    }
]);