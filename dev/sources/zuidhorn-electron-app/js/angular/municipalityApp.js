var municipalityApp = angular.module('municipalityApp', ['ui.router']);

municipalityApp.config(['ApiRequestProvider', function(ApiRequestProvider) {
    ApiRequestProvider.setHost(env_data.apiUrl);
}]);

municipalityApp.config(['$qProvider', function($qProvider) {
    $qProvider.errorOnUnhandledRejections(false);
}]);

municipalityApp.config(['$stateProvider', '$locationProvider', function($stateProvider, $locationProvider) {
    if (env_data.html5Mode.enable)
        $locationProvider.html5Mode(true);

    // Base router
    $stateProvider
        .state({
            url: '/',
            name: 'welcome',
            controller: [
                '$rootScope', '$scope', '$state', 'AuthService', 'CredentialsService',
                function($rootScope, $scope, $state, AuthService, CredentialsService) {
                    var credentails = CredentialsService.get();

                    if ((credentails == null) || (!credentails.access_token))
                        return $state.go('sign-in');

                    AuthService.getUser().then(function(response) {
                        $rootScope.user = response.data;

                        $permission = $rootScope.user.permissions[0] || false;

                        switch ($permission.key) {
                            case 'budget_upload':
                                $state.go('budget-upload');
                                break;
                            case 'budget_manage':
                                $state.go('budget-manage');
                                break;
                            case 'shopkeeper_manage':
                                $state.go('shopkeeper-manage');
                                break;
                            default:
                                $state.go('sign-out');
                                break;
                        }

                    }, console.log);
                }
            ]
        });

    // Auth routes
    $stateProvider
        .state({
            url: '/auth/sign-in',
            name: 'sign-in',
            component: 'authSignInComponent',
            data: {
                title: "Welcome",
                layout: 'auth'
            }
        })
        .state({
            url: '/auth/sign-out',
            name: 'sign-out',
            controller: ['$scope', '$state', 'AuthService', function($scope, $state, AuthService) {
                AuthService.signOut();
                $state.go('welcome');

                $scope.$emit('auth:sign-out');
            }]
        });

    // Budget uploader
    $stateProvider
        .state({
            url: '/budget/upload',
            name: 'budget-upload',
            component: 'panelBudgetUploadComponent',
            data: {
                title: "Vouchers",
                layout: 'panel'
            }
        });

    // Budget manage
    $stateProvider
        .state({
            url: '/budget/manage',
            name: 'budget-manage',
            component: 'panelBudgetManageComponent',
            data: {
                title: "Manage budget",
                layout: 'panel'
            }
        });

    // Shopkeeper manage
    $stateProvider
        .state({
            url: '/shopkeeper/manage',
            name: 'shopkeeper-manage',
            component: 'panelShopkeeperManageComponent',
            data: {
                title: "Manage Shopkeepers",
                layout: 'panel'
            }
        });
}]);

if (!env_data.html5Mode.enable)
    if (!document.location.hash)
        document.location.hash = '#!/';