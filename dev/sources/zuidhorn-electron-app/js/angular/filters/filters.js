municipalityApp.filter('pretty_json', function() {
    return function(_in) {
        return JSON.stringify(_in, null, '    ');
    }
});

municipalityApp.filter('pretty_date', function() {
    return function(_in, format) {
        return moment(_in).format(format || 'LLL');
    }
});

municipalityApp.filter('number_format', function() {
    return function(number, decimals, decPoint, thousandsSep) {
        number = (number + '').replace(/[^0-9+\-Ee.]/g, '')
        var n = !isFinite(+number) ? 0 : +number
        var prec = !isFinite(+decimals) ? 0 : Math.abs(decimals)
        var sep = (typeof thousandsSep === 'undefined') ? ',' : thousandsSep
        var dec = (typeof decPoint === 'undefined') ? '.' : decPoint
        var s = ''
        var toFixedFix = function(n, prec) {
                var k = Math.pow(10, prec)
                return '' + (Math.round(n * k) / k)
                    .toFixed(prec)
            }
            // @todo: for IE parseFloat(0.55).toFixed(0) = 0;
        s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.')
        if (s[0].length > 3) {
            s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep)
        }
        if ((s[1] || '').length < prec) {
            s[1] = s[1] || ''
            s[1] += new Array(prec - s[1].length + 1).join('0')
        }
        
        return s.join(dec)
    }
});

municipalityApp.filter('to_fixed', function() {
    return function(_in, size) {
        return parseFloat(_in).toFixed(size);
    }
});

municipalityApp.filter('uc_first', function() {
    return function(_in) {
        return _in[0].toUpperCase() + _in.slice(1);
    }
});

municipalityApp.filter('not_in', function() {
    return function(_in, _not_in) {
        var out = {};

        for (var prop in _in) {
            if (_not_in.indexOf(parseInt(prop)) == -1) {
                out[prop] = _in[prop];
            }
        }

        return out;
    }
});

municipalityApp.filter('startFrom', function() {
    return function(_in, _from) {
        return _in.slice(_from);
    }
});

municipalityApp.filter('abs', function() {
    return function(_in) {
        return Math.abs(_in);
    }
});