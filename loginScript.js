let $ = require('jquery')
let fs = require('fs')
let filename = 'users'
const ipc = require('electron').ipcRenderer;
const { app } = require('electron');

document.getElementById("txtUsr").addEventListener("keyup", event => enterKeyPressLogin(event));

document.getElementById("txtPwd").addEventListener("keyup", event => enterKeyPressLogin(event));

document.getElementById("btn-login").addEventListener("keyup", event => enterKeyPressLogin(event));

document.getElementById("btn-quit").addEventListener("keyup", event => enterKeyPressQuit(event));

document.getElementById("btn-login").addEventListener("click", loginKeyPress);

document.getElementById("btn-quit").addEventListener("click", quitKeyPress);

function loginKeyPress() {

    if (fs.existsSync(filename)) {
        let data = fs.readFileSync(filename, 'utf8').split('\n');

        data.forEach((authorities, index) => {
            let [user, password] = authorities.split(',');
            let [name1, usr] = user.split(':');
            let [name2, pass] = password.split(':');

            let txtUser = $('#txtUsr').val();
            let txtPwd = $('#txtPwd').val();

            if (txtUser == usr && txtPwd == pass) {
                ipc.sendSync('entry-accepted', 'ping');
            }
            else {
                $('#lbl').text('username or password is incorrect');
            }
        })
    }
}

function quitKeyPress() {
    ipc.sendSync('login_close-me');
}

function enterKeyPressLogin(event) {
    if (event.key !== "Enter") return;
    document.getElementById("btn-login").click();
    event.preventDefault();
}

function enterKeyPressQuit(event) {
    if (event.key !== "Enter") return;
    document.getElementById("btn-quit").click();
    event.preventDefault();
}