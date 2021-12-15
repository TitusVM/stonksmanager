var http = require("http");
var jsdom = require("jsdom");
var window = jsdom.jsdom().defaultView;
var $ = require('jquery')(window);

let Bill = require('./bill.js')
const { app } = require('electron');

class BillTab {
    constructor(bill) {
        this.category = bill.category;
        this.name = bill.name;
        this.date = bill.date;
        this.value = bill.value;
        this.monthly = bill.monthly;
        this.paid = false;
    }

    logTest() {
        console.log("herer");
    }

    printDiv() {
        $('#tabs').append("<p id='test'>My <em>new</em> text</p>");
    }
}


module.exports = BillTab