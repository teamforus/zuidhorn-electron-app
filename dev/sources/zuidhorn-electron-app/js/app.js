if (typeof require != 'undefined') {
    $ = jQuery = require('jquery');

    document.addEventListener("keydown", function(e) {
        if (e.which === 123) {
            require('electron').remote.getCurrentWindow().toggleDevTools();
        } else if (e.which === 116) {
            location.reload();
        }
    });

    // use native localStorage on mac os
    if (require('os').platform() == "darwin") {
        dataStorage = localStorage;
    } else {
        dataStorage = new(function() {
            var fs = require('fs');
            var rimraf = require('rimraf');
            var path = './storage';

            if (!fs.existsSync(path))
                fs.mkdirSync(path);

            var makePath = function(itemName) {
                return path + '/' + itemName + '.data';
            };

            this.getItem = function(itemName) {
                var filePath = makePath(itemName);

                if (fs.existsSync(filePath))
                    return fs.readFileSync(filePath);

                return null;
            };

            this.setItem = function(itemName, content) {
                var filePath = makePath(itemName);

                this.removeItem(itemName);

                return fs.writeFileSync(filePath, content);
            };

            this.removeItem = function(itemName, content) {
                var filePath = makePath(itemName);

                if (fs.existsSync(filePath))
                    return fs.unlinkSync(filePath);

                return null;
            };

            this.clear = function() {
                rimraf.sync(path + '/*.data');
            };
        })();
    }
}
var chartColors = {
    "0": "rgb(255, 99, 132)",
    "1": "rgb(255, 159, 64)",
    "2": "rgb(255, 205, 86)",
    "3": "rgb(75, 192, 192)",
    "4": "rgb(54, 162, 235)",
    "5": "rgb(153, 102, 255)",
    "6": "rgb(201, 203, 207)"
};

$ctrl = {};

$ctrl.initChart = function(inputData) {
    var data = inputData.map(function(option) {
        return option.value;
    });
    
    var labels = inputData.map(function(option) {
        return option.label;
    });

    var sum = data.reduce(function(total, value) {
        return total + value;
    });

    $ctrl.inputData = inputData;
    $ctrl.countResponses = sum;

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
            responsive: true
        }
    };

    // http://www.chartjs.org/
    if (document.getElementById("myChart")) {
        var myPieChart = new Chart(document.getElementById("myChart").getContext("2d"), config);
    }
};

$ctrl.initChart([{
    label: "First",
    value: 5
}, {
    label: "Second",
    value: 10
}, {
    label: "Third",
    value: 15
}]);