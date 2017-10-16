municipalityApp.component('authSignInComponent', {
    templateUrl: './tpl/pages/auth/sign-in.html',
    controller: [
        '$rootScope',
        '$state',
        '$scope',
        'AuthService',
        'FormBuilderService',
        'CredentialsService',
        function(
            $rootScope,
            $state,
            $scope,
            AuthService,
            FormBuilderService,
            CredentialsService
        ) {
            var ctrl = this;

            ctrl.forms = {};
            ctrl.forms.sign_in = FormBuilderService.build();

            ctrl.submitSignIn = function(e, form) {
                e && (e.preventDefault() & e.stopPropagation());

                if (this.is_locked)
                    return;

                form.lock();

                AuthService.signIn(form.values).then(function(response) {
                    CredentialsService.set(response.data);

                    $scope.$emit('auth:sign-in');

                    form.reset().unlock();

                    $state.go('welcome');
                }, function(response) {
                    form.fillErrors({
                        password: ["Wrong username or password."]
                    }).unlock();
                });
            };
        }
    ]
});