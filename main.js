
const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const url = require('url')
const { dialog } = require('electron')


let mainWindow
let loginScreen
let budgetScreen

function createWindows() {

    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        show: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true,
        }
    })

    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file',
        slashes: true
    }))

    budgetScreen = new BrowserWindow({
        show: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true,
        }
    })
    budgetScreen.loadURL(url.format({
        pathname: path.join(__dirname, 'budget.html'),
        protocol: 'file',
        slashes: true
    }))

    
    loginScreen = new BrowserWindow({
        parent: budgetScreen,
        width: 600,
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
    loginScreen.loadURL(url.format({
        pathname: path.join(__dirname, 'login.html'),
        protocol: 'file',
        slashes: true
    }))
    loginScreen.setBackgroundColor('#00000000')
    //loginScreen.webContents.openDevTools({ mode: 'undocked' })

}

ipcMain.on('entry-accepted', (event, arg) => {
    if (arg == 'ping') {
        //mainWindow.show()
        budgetScreen.show()
        loginScreen.hide()
    }
})

ipcMain.on('close-me', (evt, arg) => {
    app.quit()
})

ipcMain.on('open-CSV', (evt, arg) => {
    //showDialog qui demande le CSV
    dialog.showOpenDialog(budgetScreen, {properties: ['openFile']})
})

app.on('ready', function () {
    setTimeout(function () {
        createWindows();
    }, 300);
});

