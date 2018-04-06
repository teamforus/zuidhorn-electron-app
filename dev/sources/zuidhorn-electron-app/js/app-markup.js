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

$ctrl.initChart = function(elementId, inputData) {
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
    if (document.getElementById(elementId)) {
        var myPieChart = new Chart(document.getElementById(elementId).getContext("2d"), config);
    }
};

$ctrl.initChart("myChart1", [{
    label: "First",
    value: 5
}, {
    label: "Second",
    value: 10
}, {
    label: "Third",
    value: 15
}]);

$ctrl.initChart("myChart2", [{
    label: "First",
    value: 5
}, {
    label: "Second",
    value: 10
}, {
    label: "Third",
    value: 15
}]);

$ctrl.initChart("myChart3", [{
    label: "First",
    value: 5
}, {
    label: "Second",
    value: 10
}, {
    label: "Third",
    value: 15
}]);