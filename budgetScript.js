let $ = require('jquery')
const ipc = require('electron').ipcRenderer;
const { app } = require('electron');

$('#btn-openJSON').on('click', () => {
    ipc.send('open-JSON')
})

$('#btn-generateStatement').on('click', () => {
    // nothing yet
})