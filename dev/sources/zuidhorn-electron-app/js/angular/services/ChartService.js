municipalityApp.service('ChartService', [
    '$http',
    '$q',
    'ApiRequest',
    function(
        $http,
        $q,
        ApiRequest
    ) {
        var chartColors = {
            "0": "rgb(255, 99, 132)",
            "1": "rgb(255, 159, 64)",
            "2": "rgb(255, 205, 86)",
            "3": "rgb(75, 192, 192)",
            "4": "rgb(54, 162, 235)",
            "5": "rgb(153, 102, 255)",
            "6": "rgb(201, 203, 207)"
        };

        var getRandomColor = function () {
            var letters = '0123456789ABCDEF';
            var color = '#';
            
            for (var i = 0; i < 6; i++) {
              color += letters[Math.floor(Math.random() * 16)];
            }

            return color;
        }

        var chartLib = function() {
            var self = this;

            this.totals = {};
            this.inputData = {};

            this.addChart = function(elementId, inputData) {
                var data = inputData.map(function(option) {
                    return option.value;
                });
            
                var sum = data.reduce(function(total, value) {
                    return total + value;
                });
                
                var labels = inputData.map(function(option) {
                    return option.label + " (" +  ((
                        option.value / (sum / 100)
                    ) || 0).toFixed(2) + "%)";
                });
            
                self.inputData[elementId] = inputData;
                self.totals[elementId] = sum;

                for (var prop in inputData) {
                    if (typeof chartColors[prop] == 'undefined') {
                        chartColors[prop] = getRandomColor();
                    }
                }
            
                var config = {
                    type: 'pie',
                    data: {
                        datasets: [{
                            data: data,
                            backgroundColor: Object.values(chartColors).splice(0, data.length),
                            label: 'Dataset 1'
                        }],
                        labels: labels
                    },
                    options: {
                        responsive: true,
                        legend: {
                            display: false
                        }
                    }
                };
           
                // http://www.chartjs.org/
                if (document.getElementById(elementId)) {
                    var myPieChart = new Chart(
                        document.getElementById(elementId).getContext("2d"), config
                    );
                }
            };

        };

        return {
            make: function(type, data) {
                return new chartLib();   
            }
        };
    }
]);