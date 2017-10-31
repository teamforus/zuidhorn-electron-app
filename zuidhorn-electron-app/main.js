let Electron = require('electron');

let BrowserWindow = Electron.BrowserWindow;
let Menu = Electron.Menu;
let Tray = Electron.Tray;
let App = Electron.app;

let open = require('open');
let path = require('path')

App.commandLine.appendSwitch('--ignore-gpu-blacklist');

App.on('ready', function() {
    let appIcon = new Tray(path.join(__dirname, 'www/assets/img/favicon.png'));

    let win = new BrowserWindow({
        minWidth: 1024,
        minHeight: 650,
        show: false,
        backgroundColor: '#000000',
        center: true,
        icon: path.join(__dirname, 'www/assets/img/favicon.png')
    });

    Menu.setApplicationMenu(
        Electron.Menu.buildFromTemplate([{
            label: "Zuidhorn App",
            submenu: [{
                label: "Quit",
                accelerator: "Command+Q",
                click: function() {
                    App.quit();
                }
            }]
        }, {
            label: "Edit",
            submenu: [{
                label: "Undo",
                accelerator: "CmdOrCtrl+Z",
                selector: "undo:"
            }, {
                label: "Redo",
                accelerator: "Shift+CmdOrCtrl+Z",
                selector: "redo:"
            }, {
                type: "separator"
            }, {
                label: "Cut",
                accelerator: "CmdOrCtrl+X",
                selector: "cut:"
            }, {
                label: "Copy",
                accelerator: "CmdOrCtrl+C",
                selector: "copy:"
            }, {
                label: "Paste",
                accelerator: "CmdOrCtrl+V",
                selector: "paste:"
            }, {
                label: "Select All",
                accelerator: "CmdOrCtrl+A",
                selector: "selectAll:"
            }]
        }])
    );

    win.setMenu(new Menu());
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
        App.quit();
    });
});