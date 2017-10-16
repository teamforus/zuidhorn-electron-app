municipalityApp.service('ChildEstimationService', ['$http', function($http) {
    var service = {
        single: 119,
        couple: 164,
        child: 82,
        getSelection: function() {
            var selection = [];
            var percentages = [.8, .9, 1];

            for (var i = 0; i <= 10; i++) {
                selection[i] = [];

                for (var j = percentages.length - 1; j >= 0; j--) {
                    selection[i].push(((this.single + (this.child * i)) * percentages[j]).toFixed(2));
                    selection[i].push(((this.couple + (this.child * i)) * percentages[j]).toFixed(2));
                }
            }

            return selection;
        },
        estimateChildsByBudget: function(val) {
            var count_childrens = 1;
            var selection = this.getSelection();

            val = val.toFixed(2);

            for (var i = selection.length - 1; i >= 0; i--) {
                if (selection[i].indexOf(val) != -1)
                    return [i];
            }

            return [0];
        }
    };

    return service;
}]);