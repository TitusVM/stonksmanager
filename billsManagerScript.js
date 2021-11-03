let $ = require('jquery')
const ipc = require('electron').ipcRenderer;
const { app } = require('electron');

$('#btn-quit').on('click', () => {
    ipc.send('billsManager_close-me')
})