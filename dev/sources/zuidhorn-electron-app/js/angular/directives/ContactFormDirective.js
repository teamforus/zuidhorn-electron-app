municipalityApp.directive('contactForm', [
    'ContactFormService',
    'FormBuilderService',
    function(
        ContactFormService,
        FormBuilderService
    ) {
        return {
            restrict: 'A',
            templateUrl: './tpl/directives/contact-form.html',
            replace: true,
            transclude: true,
            scope: true,
            link: function($scope, iElm, iAttrs, controller) {
                $scope.subjects = [{
                    key: 'other',
                    name: 'Other'
                }, {
                    key: 'tehnical_issuse',
                    name: 'Tehnical issuse'
                }];

                $scope.forms = {};
                $scope.forms.contact_form = FormBuilderService.build();
                $scope.forms.contact_form.values.subject = $scope.subjects[0];

                $scope.submitContactForm = function(e, form) {
                    e && (e.preventDefault() & e.stopPropagation());

                    if (form.submited)
                        return;

                    var values = JSON.parse(JSON.stringify(form.values));

                    values.subject = values.subject.key;

                    form.submited = true;

                    ContactFormService.submitForm(values).then(function(response) {
                        form.submited = false;
                        form.success = true;
                        form.reset();
                    }, function(response) {
                        form.errors = response.data;
                        form.submited = false;
                    });
                };
            }
        };
    }
]);