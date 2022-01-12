import { pythonipc } from './python-ipc.js';
let $ = require('jquery')
const ipc = require('electron').ipcRenderer;
import { Bill } from './bill.js';

var Tab1Pressed = true;
var Tab2Pressed = false;

let username = ipc.sendSync('get-username');
/**
 * @type {Bill[]}
 */
let bills = [];
/**
 * @type {Bill}
 */
let selectedBill = null;
let selectedButton = null;
let tab1 = $("#par1");
let tab2 = $("#par2");
let tab1button = $("#tab-button-1");
let tab2button = $("#tab-button-2");


$('#btn-newBill').on('click', () => {
    if ($("#txt-name").val() != "" && $("#dt-date").val() != "jj.mm.aaaa" && $("#nb-value").val() != 0) {
        let bill = new Bill(
            $("#categories").val(),
            $("#txt-name").val(),
            new Date($("#dt-date").val()),
            $("#nb-value").val() * -1,
            $("#cbx-monthly")[0].checked
        );
        bill.logTest();
        bills.push(bill);
        populateLists(bills);

        let json = billsToJson(bills);
        console.log(json);
        pythonipc(function(){}, "bills", ["save", username], json);
    }
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
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    let val = year + "-";
    if (month < 10) {
        val += "0";
    }
    val += month + "-";
    if (day < 10) {
        val += "0";
    }
    val += day;
    return val;
}

/**
 * @param {string} val
 */
function valToDate(val) {
    return new Date(val);
}

/**
 * @param {Bill} bill 
 */
function showInfos(bill, t) {
    $("#txt-showName").val(bill.name);
    $("#txt-showCategory").val(bill.category);
    $("#txt-showDate").val(dateToVal(bill.date));
    $("#cbx-showMonthly")[0].checked = bill.monthly;
    $("#txt-showValue").val(bill.value * -1);
    $("#btn-savechanges").removeAttr("disabled");
    selectedBill = bill;
    if (selectedButton) {
        selectedButton.removeClass("selected");
    }
    selectedButton = $(t);
    selectedButton.addClass("selected");
}

/**
 * @param {Bill[]} bills 
 */
function populateLists(bills) {
    tab1.empty();
    tab2.empty();
    $("#btn-savechanges").attr("disabled", "");
    $("#txt-showName").val("");
    $("#txt-showCategory").val("");
    $("#txt-showDate").val("");
    $("#cbx-showMonthly")[0].checked = false;
    $("#txt-showValue").val(0);

    bills.forEach(function(bill) {
        let billButton = $("<button>");
        billButton.text(bill.name);
        billButton.on("click", function() {
            showInfos(bill, this);
        });

        if (bill.date < Date.now()) {
            tab2.append(billButton);
        } else {
            tab1.append(billButton);
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

/**
 * @param {Bill[]} bills
 */
function billsToJson(bills) {
    let json = [];
    bills.forEach(function(b) {
        const obj = {
            "description": b.name,
            "date": b.date.toISOString().split("Z")[0],
            "amount": b.value,
            "category": b.category,
            "is_monthly": b.monthly
        };
        json.push(obj);
    });
    return json;
}

$("#btn-savechanges").on("click", function() {
    selectedBill.name = $("#txt-showName").val();
    selectedBill.category = $("#txt-showCategory").val();
    selectedBill.date = valToDate($("#txt-showDate").val());
    selectedBill.monthly = $("#cbx-showMonthly")[0].checked;
    selectedBill.value = $("#txt-showValue").val() * -1;
    console.log("Saving changes...");
    pythonipc(function(){}, "bills", ["save", username], billsToJson(bills));
    populateLists(bills);
});

pythonipc(function(res) {
    bills = Bill.arrayFromJson(res);
    console.log("Loaded bills for " + username);
    populateLists(bills);
}, "bills", [
    "load",
    username
]);

$("#btn-import").on("click", function() {
    let filepath = ipc.sendSync("open-JSON");
    if (!filepath) {
        alert("Impossible d'ouvrir le fichier.");
        return;
    }

    pythonipc(function(loadedjson) {
        console.log("Loaded bills from bank file: " + filepath);
        Bill.arrayFromJson(loadedjson).forEach(function(b) {
            bills.push(b);
        });
        console.log(bills);
        populateLists(bills);
        pythonipc(function(){}, "bills", ["save", username], billsToJson(bills));
    }, "transacs", filepath);
});