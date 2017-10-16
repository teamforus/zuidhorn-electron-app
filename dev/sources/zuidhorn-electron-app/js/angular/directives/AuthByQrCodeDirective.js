municipalityApp.directive('authByQrCode', [
    '$state',
    '$timeout',
    'AuthService',
    'CredentialsService',
    function(
        $state,
        $timeout,
        AuthService,
        CredentialsService
    ) {
        return {
            restrict: 'A',
            templateUrl: './tpl/directives/auth-by-qr-code.html',
            replace: true,
            transclude: true,
            link: function($scope, iElm, iAttrs, controller) {
                var destroyed = false;

                $scope.timeout = false;

                var checkToken = function(token, success, error) {
                    AuthService.checkTokenState(token).then(function(response) {
                        if (!destroyed) {
                            if (response.data.authorized) {
                                success(response);
                            } else {
                                error(response);
                            }
                        }
                    }, function(response) {
                        if (!destroyed)
                            error(response);
                    });
                };

                $scope.showQrCode = function(e) {
                    e && e.stopPropagation() & e.preventDefault();

                    AuthService.generateToken().then(function(response) {
                        $scope.token = response.data.token;
                        var count = 0;

                        var qr_code = document.createElement("div");

                        var qrcode = new QRCode(qr_code, {
                            text: $scope.token,
                            width: 300,
                            height: 300,
                            colorDark: "#000000",
                            colorLight: "#ffffff",
                            correctLevel: QRCode.CorrectLevel.H
                        });

                        $(qr_code).find('img').bind('load', function() {
                            $scope.timeout = $timeout(function() {
                                $scope.qr_code = $(qr_code).find('img').attr('src');
                            }, 0);
                        });

                        var successHandler = function(response) {
                            response.data.token;

                            CredentialsService.set(response.data);
                            $state.go('panel-offices');

                            $scope.$emit('auth:sign-in');
                        };

                        var errorHandler = function() {
                            $scope.timeout = $timeout(function() {
                                checkToken($scope.token, successHandler, errorHandler);
                            }, 2500);
                        };

                        checkToken($scope.token, successHandler, errorHandler);
                    });
                }

                $scope.$on("$destroy", function() {
                    $timeout.cancel($scope.timeout);
                    destroyed = true;
                });

                $('[tabulation]').tabulation();
            }
        };
    }
]);