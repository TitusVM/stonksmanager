const { app, BrowserWindow, ipcMain, dialog, ipcRenderer } = require('electron');
const path = require('path');
const url = require('url');
var { PythonShell } = require('python-shell');
const { truncate } = require('fs');

let mainWindow;
let loginWindow;

let username;

function createWindows() {

    mainWindow = new BrowserWindow({
        minWidth: 1200,
        minHeight: 720,
        show: false,
        autoHideMenuBar: true,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true,
            webviewTag: true
        }
    });

    loginWindow = new BrowserWindow({
        parent: mainWindow,
        width: 400,
        height: 320,
        transparent: true,
        frame: false,
        resizable: false,
        maximizable: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true,
        }
    });

    loginWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'login.html'),
        protocol: 'file',
        slashes: true
    }));

    loginWindow.setBackgroundColor('#00000000');
}

/* User logged in */
ipcMain.on('entry-accepted', (e, name) => {
    username = name;
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'budget.html'),
        protocol: 'file',
        slashes: true
    }));
    mainWindow.show();
    loginWindow.close();
});

ipcMain.on('get-username', (e, a) => {
    e.returnValue = username;
});

/* Quit from login */
ipcMain.on('close-me', (evt, arg) => {
    app.quit();
});

/* Open the file dialog to select a json file */
ipcMain.on('open-JSON', (evt, arg) => {
    dialog.showOpenDialog(mainWindow, {
        properties: ['openFile'],
        filters: [{
            name: 'JSON', extensions: ['json']
        }]
    }).then(result => {
        if (result.canceled) {
            evt.returnValue = null;
        } else {
            evt.returnValue = result.filePaths[0];
        }
    }).catch(err => {
        console.log(err) // avoid crashes
    });
});

app.on('ready', function () {
    setTimeout(function () {
        createWindows();
    }, 300);
});