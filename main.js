
const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const url = require('url')
const { dialog } = require('electron')


let mainWindow
let loginScreen
let budgetScreen
let billsManagerScreen

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

    billsManagerScreen = new BrowserWindow({
        parent: budgetScreen,
        show: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true,
        }
    })
    billsManagerScreen.loadURL(url.format({
        pathname: path.join(__dirname, 'billsManager.html'),
        protocol: 'file',
        slashes: true
    }))

}

ipcMain.on('entry-accepted', (event, arg) => {
    if (arg == 'ping') {
        //mainWindow.show()
        budgetScreen.show()
        loginScreen.close()
    }
})

ipcMain.on('login_close-me', (evt, arg) => {
    app.quit()
})

ipcMain.on('open-JSON', (evt, arg) => {
    //showDialog qui demande le JSON
    dialog.showOpenDialog(budgetScreen, {
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

ipcMain.on('bills-manager', (evt, arg) => {
    billsManagerScreen.show()
    budgetScreen.hide()
})

ipcMain.on('billsManager_close-me', (evt, arg) => {
    budgetScreen.show()
    billsManagerScreen.hide()
})

app.on('ready', function () {
    setTimeout(function () {
        createWindows();
    }, 300);
});

