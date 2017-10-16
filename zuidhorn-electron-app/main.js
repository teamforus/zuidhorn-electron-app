var app = require('electron').app;
var open = require('open');
var path = require('path');
var electron = require('electron');

var Tray = electron.Tray;
var BrowserWindow = electron.BrowserWindow;

var win;

app.commandLine.appendSwitch('--ignore-gpu-blacklist');

app.on('ready', function() {
    const appIcon = new Tray(path.join(__dirname, 'www/assets/img/favicon.png'));

    win = new BrowserWindow({
        minWidth: 1024,
        minHeight: 650,
        show: false,
        backgroundColor: '#000000',
        center: true,
        icon: path.join(__dirname, 'www/assets/img/favicon.png')
    });
    
    var menu = new electron.Menu();
    var appMenu = new electron.Menu();
    
    appMenu.append(new electron.MenuItem({
        click: function() {
            app.quit();
        },
        label: 'Exit'
    }))
    
    menu.append(new electron.MenuItem({
        label: 'Application',
        submenu: appMenu
    }));

    win.setMenu(menu);
    win.loadURL('file://' + __dirname + '/www/index.html');

    win.once('ready-to-show', function() {
        win.show();
        win.maximize();
    });

    win.webContents.on('new-window', function(event, url) {
        if (url.indexOf('http') === 0) {
            event.preventDefault();
            open(url);
        }
    });

    win.on('closed', function() {
        app.quit();
    });
});