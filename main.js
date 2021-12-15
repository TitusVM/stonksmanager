const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const path = require('path')
const url = require('url')
var { PythonShell } = require('python-shell');
const { truncate } = require('fs');
var Bill = require('./bill');


let mainWindow
let loginWindow

function createWindows() {

    mainWindow = new BrowserWindow({
        width: 900,
        height: 600,
        show: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true,
            webviewTag: true
        }
    })

    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'budget.html'),
        protocol: 'file',
        slashes: true
    }))

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
    })
    loginWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'login.html'),
        protocol: 'file',
        slashes: true
    }))
    loginWindow.setBackgroundColor('#00000000')
}

ipcMain.on('entry-accepted', (event, arg) => {
    if (arg == 'ping') {
        mainWindow.show()
        loginWindow.close()
    }
})

ipcMain.on('close-me', (evt, arg) => {
    app.quit()
})

ipcMain.on('new-bill', (evt, arg) => {
    let bill = new Bill();
    bill.logTest()
})

ipcMain.on('open-JSON', (evt, arg) => {
    //showDialog qui demande le JSON
    dialog.showOpenDialog(mainWindow, {
        properties: ['openFile'],
        filters: [{
            name: 'JSON', extensions: ['json']
        }]
    }).then(result => {
        //console.log(result.canceled) => Did user cancel ? 
        console.log(result.filePaths) // file path
    }).catch(err => {
        console.log(err) // avoid crashes
    })
})

app.on('ready', function () {
    setTimeout(function () {
        createWindows();
    }, 300);
});

