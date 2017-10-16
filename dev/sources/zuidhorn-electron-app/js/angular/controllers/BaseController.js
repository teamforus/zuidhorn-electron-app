municipalityApp.controller('BaseController', [
    '$rootScope',
    '$scope',
    '$state',
    'AuthService',
    'CategoryService',
    'FormBuilderService',
    'CredentialsService',
    'TransactionService',
    'ShopKeeperService',
    'OfficeService',
    function(
        $rootScope,
        $scope,
        $state,
        AuthService,
        CategoryService,
        FormBuilderService,
        CredentialsService,
        TransactionService,
        ShopKeeperService,
        OfficeService
    ) {
        $rootScope.$state = $state; 
        
        $scope.$on('auth:sign-in', function() {
            $rootScope.credentials = CredentialsService.get();
            $scope.initializePanel();
        });

        $scope.$on('auth:sign-up', function() {
            $rootScope.credentials = CredentialsService.get();
        });

        $scope.$on('auth:sign-out', function() {
            $rootScope.credentials = false;
        });

        $scope.$on('auth:unauthenticated', function() {
            $state.go('sign-out');
        });

        $scope.$on('user:sync', function() {
            syncUserData();
        });

        var syncUserData = function() {
            AuthService.getUser().then(function(response) {
                $rootScope.user = response.data || {};
            });
        }

        $scope.initializePanel = function() {
            syncUserData();
        };

        $rootScope.credentials = CredentialsService.get();

        if ($rootScope.credentials)
            $scope.initializePanel();
    }
]);