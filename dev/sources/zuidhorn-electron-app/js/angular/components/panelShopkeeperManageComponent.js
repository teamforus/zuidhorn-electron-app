municipalityApp.component('panelShopkeeperManageComponent', {
    templateUrl: './tpl/pages/shopkeeper/manage.html',
    controller: [
        '$rootScope',
        '$state',
        '$scope',
        '$timeout',
        'CategoryService',
        'ShopKeeperService',
        'CredentialsService',
        'FormBuilderService',
        function(
            $rootScope,
            $state,
            $scope,
            $timeout,
            CategoryService,
            ShopKeeperService,
            CredentialsService,
            FormBuilderService
        ) {
            var ctrl = this;

            ctrl.states = ShopKeeperService.availableStates();
            ctrl.categories = [];
            ctrl.active_filters = {};

            ctrl.states.unshift({
                name: 'All',
                value: 'all'
            });

            ctrl.shopkeepers = [];


            ctrl.forms = {};
            ctrl.forms.filters = FormBuilderService.build();

            var loadShopkeeperService = function() {
                ShopKeeperService.list().then(function(response) {
                    ctrl.shopkeepers = response.data.map(function(shopkeeper) {
                        shopkeeper.categoriesStr = shopkeeper.categories.map(function(category) {
                            return category.name;
                        }).join(',');

                        return shopkeeper;
                    });

                    ctrl.forms.filters.values.state = ctrl.states[0];
                    ctrl.forms.filters.values.category = ctrl.categories[0];

                    ctrl.submitFilters = function(e, form) {
                        e && (e.preventDefault() & e.stopPropagation());

                        ctrl.forms.filters.success = true;

                        $timeout(function() {
                            ctrl.forms.filters.success = false;
                        }, 1000);

                        ctrl.active_filters = {
                            name: form.values.name,
                            kvk_number: form.values.kvk_number,
                        };

                        if (form.values.state.value != 'all')
                            ctrl.active_filters.state = form.values.state.value;

                        if (form.values.category.id != false)
                            ctrl.active_filters.categoriesStr = form.values.category.name;
                    }

                    ctrl.showStatusSelect = function(e, shopkeeper) {
                        e && (e.preventDefault() & e.stopPropagation());

                        shopkeeper.show_status_menu = !shopkeeper.show_status_menu;
                    };

                    var changeStatusAction = false;

                    ctrl.changeStatus = function(e, shopkeeper, state) {
                        e && (e.preventDefault() & e.stopPropagation());

                        if (changeStatusAction)
                            return;

                        changeStatusAction = true;

                        shopkeeper.status = 'updating';

                        ShopKeeperService.setStates(shopkeeper.id, state).then(function() {
                            changeStatusAction = false;
                            
                            loadShopkeeperService();
                        });
                    };
                });
            };

            CategoryService.list().then(function(response) {
                ctrl.categories = response.data;
                ctrl.categories.unshift({
                    name: 'All',
                    id: false
                });

                loadShopkeeperService();
            });
        }
    ]
});