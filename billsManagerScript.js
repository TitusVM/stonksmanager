let $ = require('jquery')
const ipc = require('electron').ipcRenderer;
const { app } = require('electron');

$('#btn-newBill').on('click', () => {
    let category = document.getElementById("categories").value;
    let name = document.getElementById("txt-name").value;
    let date = document.getElementById("dt-date").value;
    let value = document.getElementById("nb-value").value;
    let monthly = document.getElementById("cbx-monthly").checked;

    if (name != "" && date !="jj.mm.aaaa" && value != 0) {
        ipc.send('new-bill', category, name, date, value, monthly)
    }
})
