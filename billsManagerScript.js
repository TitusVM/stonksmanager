let $ = require('jquery')
const ipc = require('electron').ipcRenderer;
const { app } = require('electron');

var Tab1Pressed = true;
var Tab2Pressed = false;



$('#btn-newBill').on('click', () => {
    ipc.send('new-bill')
})

function tab1press() {
    if (!Tab1Pressed) {
        $("#tab-button-2").toggleClass("active");
        $("#tab-button-1").toggleClass("active");

        // Hide whole page
        $("#par1").css("visibility", "visible");
        $("#par2").css("visibility", "hidden");

        Tab1Pressed = true;
        Tab2Pressed = false;
    }
}

function tab2press() {
    if (!Tab2Pressed) {
        $("#tab-button-1").toggleClass("active");
        $("#tab-button-2").toggleClass("active");

        // Hide whole page
        $("#par1").css("visibility", "hidden");
        $("#par2").css("visibility", "visible");

        Tab1Pressed = false;
        Tab2Pressed = true;
    }
}

