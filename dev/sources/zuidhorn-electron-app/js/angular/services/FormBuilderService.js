municipalityApp.service('FormBuilderService', ['$http', function($http) {
    return new(function() {
        this.build = function() {
            return {
                values: {},
                errors: {},
                is_locked: false,
                fillValues: function(source, fields) {
                    for (var prop in fields) {
                        this.values[fields[prop]] = source[fields[prop]];
                    }

                    return this;
                },
                fillErrors: function(errors) {
                    this.errors = errors || [];

                    return this;
                },
                resetValues: function() {
                    this.values = {};

                    return this;
                },
                resetErrors: function() {
                    this.errors = {};

                    return this;
                },
                reset: function() {
                    return this.resetValues().resetErrors();
                },
                unlock: function() {
                    this.is_locked = false;

                    return this;
                },
                lock: function() {
                    this.is_locked = true;

                    return this;
                }
            };
        };
    });
}]);