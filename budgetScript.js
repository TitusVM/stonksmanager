let $ = require('jquery')
const ipc = require('electron').ipcRenderer;
const { app } = require('electron');

$('#btn-openCSV').on('click', () => {
    ipc.send('open-CSV')
})

$('#btn-quit').on('click', () => {
    ipc.send('close-me')
})