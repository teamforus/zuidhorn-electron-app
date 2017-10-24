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