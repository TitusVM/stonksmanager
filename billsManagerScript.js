let $ = require('jquery')
const ipc = require('electron').ipcRenderer;
const { app } = require('electron');

$('#btn-newBill').on('click', () => {
    ipc.send('new-bill')
})