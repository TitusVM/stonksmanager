import { pythonipc } from './python-ipc.js';
let $ = require('jquery')
const ipc = require('electron').ipcRenderer;
import { Bill } from './bill.js';

var Tab1Pressed = true;
var Tab2Pressed = false;

let username = ipc.sendSync('get-username');
let bills = [];
let tab1 = $("#par1");
let tab2 = $("#par2");
let tab1button = $("#tab-button-1");
let tab2button = $("#tab-button-2");


$('#btn-newBill').on('click', () => {
    let bill = new Bill(
        "",
        $("#txt-name").val(),
        $("#dt-date").val(),
        $("#nb-value").val(),
        $("#cbx-monthly")[0].checked
    );
    bill.logTest();
});

function tab1press() {
    if (!Tab1Pressed) {
        tab1button.toggleClass("active");
        tab2button.toggleClass("active");

        // Hide whole page
        tab1.removeClass("invisible");
        tab2.addClass("invisible");

        Tab1Pressed = true;
        Tab2Pressed = false;
    }
}

function tab2press() {
    if (!Tab2Pressed) {
        tab1button.toggleClass("active");
        tab2button.toggleClass("active");

        // Hide whole page
        tab1.addClass("invisible");
        tab2.removeClass("invisible");

        Tab1Pressed = false;
        Tab2Pressed = true;
    }
}

tab1button.on("click", tab1press);
tab2button.on("click", tab2press);

/**
 * @param {Date} date 
 */
function dateToVal(date) {
    let val = date.getFullYear() + "-";
    if (date.getMonth() < 10) {
        val += "0";
    }
    val += date.getMonth() + "-";
    if (date.getDay() < 10) {
        val += "0";
    }
    val += date.getDay();
    return val;
}

/**
 * @param {Bill} bill 
 */
function showInfos(bill) {
    $("#txt-showName").val(bill.name);
    $("#txt-showCategory").val(bill.category);
    $("#txt-showDate").val(dateToVal(bill.date));
    $("#cbx-showMonthly")[0].checked = bill.monthly;
    $("#txt-showValue").val(bill.value * -1);
}

/**
 * @param {Bill[]} bills 
 */
function populateLists(bills) {
    tab1.empty();
    tab2.empty();

    bills.forEach(function(bill) {
        let billButton = $("<button>");
        billButton.text(bill.name);
        billButton.on("click", function() {
            showInfos(bill);
        });

        if (bill.date < Date.now()) {
            tab2.append(billButton);
        } else {
            tab2.append(billButton);
        }
    });

    if (tab2.children().length == 0) {
        tab2.append("<p>Rien à afficher...</p>");
    }
    if (tab1.children().length == 0) {
        tab1.append("<p>Rien à afficher...</p>");
        tab2button.trigger("click");
    }
}

pythonipc(function(res) {
    bills = Bill.arrayFromJson(res);
    console.log("Loaded bills for " + username);
    populateLists(bills);
}, "bills", [
    "load",
    username
]);