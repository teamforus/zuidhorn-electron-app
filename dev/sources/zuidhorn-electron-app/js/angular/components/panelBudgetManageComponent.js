municipalityApp.component('panelBudgetManageComponent', {
    templateUrl: './tpl/pages/budget/manage.html',
    controller: [
        '$rootScope',
        '$state',
        '$scope',
        '$timeout',
        'AuthService',
        'BudgetService',
        'CredentialsService',
        'FormBuilderService',
        function(
            $rootScope,
            $state,
            $scope,
            $timeout,
            AuthService,
            BudgetService,
            CredentialsService,
            FormBuilderService
        ) {
            var ctrl = this;

            ctrl.fundsInfo = {};
            ctrl.forms = {};
            ctrl.forms.budget = FormBuilderService.build();

            BudgetService.getBudget().then(function(response) {
                var budget = ctrl.budget = response.data;

                ctrl.forms.budget.fillValues(budget, ['name', 'amount_per_child']);
            }, console.log);

            ctrl.submitBudgetForm = function(e, form) {
                e && (e.stopPropagation() & e.preventDefault());

                if (form.is_locked)
                    return;

                form.lock();

                BudgetService.updateBudget(form.values).then(function(response) {
                    form.resetErrors().unlock();
                    form.success = true;

                    if (typeof form.successTimeout == 'object')
                        $timeout.cancel(form.successTimeout);

                    form.successTimeout = $timeout(function() {
                        form.success = false;
                        form.successTimeout = false;
                    }, 1000);
                }, function(response) {
                    form.fillErrors(response.data).unlock();
                });
            };

            var fetchfundsAvailable = function() {
                AuthService.fundsAvailable().then(function(response) {
                    ctrl.fundsInfo.funds = response.data.funds;
                    ctrl.fundsInfo.funds_required = response.data.funds_required;
                    ctrl.fundsInfo.diff =
                        ctrl.fundsInfo.funds - ctrl.fundsInfo.funds_required;

                    console.log(ctrl.fundsInfo);
                });
            };

            fetchfundsAvailable();
        }
    ]
});