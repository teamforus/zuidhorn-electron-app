municipalityApp.provider('ApiRequest', function() {
    return new(function() {
        var host = false;

        this.setHost = function(_host) {
            while (_host[_host.length - 1] == '/')
                _host = _host.slice(0, _host.length - 1);

            host = _host;
        };

        this.$get = [
            '$q',
            '$http',
            '$state',
            '$rootScope',
            'DeviceIdService',
            function(
                $q,
                $http,
                $state,
                $rootScope,
                DeviceIdService
            ) {
                var resolveUrl = function(input) {
                    var parser = document.createElement('a');

                    parser.href = input;

                    var pathname = parser.pathname.split('/');

                    if (pathname[0] !== '')
                        pathname.unshift('');

                    return parser.protocol + '//' + parser.host + pathname.join('/');
                }

                var makeHeaders = function() {
                    var credentails = JSON.parse(localStorage.getItem('credentails'));

                    return {
                        'Accept': 'application/json',
                        'Authorization': 'Bearer ' + (credentails ? credentails.access_token : ''),
                        'Device-Id': DeviceIdService.getDeviceId().id,
                    };
                };

                var get = function(endpoint, data, headers) {
                    return ajax('GET', endpoint, data, headers);
                };

                var post = function(endpoint, data, headers) {
                    return ajax('POST', endpoint, data, headers);
                };

                var ajax = function(method, endpoint, data, headers, debug) {
                    var params = {};

                    params.data = data || {};
                    params.headers = Object.assign(makeHeaders(), headers || {});

                    params.url = resolveUrl(host + endpoint);
                    params.method = method;

                    return $q(function(done, reject) {
                        $http(params).then(function(response) {
                            done(response);
                        }, function(response) {
                            if (!debug && (response.status == 401)) {
                                if ((response.data.error == 'device-pending') ||
                                    (response.data.error == 'device-unknown'))
                                    return $rootScope.$broadcast(
                                        'device:unauthorized',
                                        response.data);

                                if ((response.data.error == 'shopkeeper-pending'))
                                    return $rootScope.$broadcast(
                                        'shopkeeper:pending', response.data);

                                if ((response.data.error == 'shopkeeper-declined'))
                                    return $rootScope.$broadcast(
                                        'shopkeeper:declined', response.data);

                                if ((response.data.error == 'Unauthenticated.')) {
                                    return $rootScope.$broadcast(
                                        'auth:unauthenticated', response.data);
                                }
                            }

                            reject(response);
                        });
                    });
                };

                return {
                    get: get,
                    post: post,
                    ajax: ajax,
                }
            }
        ];
    });
});