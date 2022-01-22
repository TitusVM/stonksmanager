let $ = require('jquery');
let fs = require('fs');
let filename = 'users';
const ipc = require('electron').ipcRenderer;
const { app } = require('electron');
const { fx } = require('jquery');

document.getElementById("txtUsr").addEventListener("keyup", event => enterKeyPressRegister(event));
document.getElementById("txtPwd").addEventListener("keyup", event => enterKeyPressRegister(event));
document.getElementById("txtRepeat").addEventListener("keyup", event => enterKeyPressRegister(event));
document.getElementById("btn-register").addEventListener("keyup", event => enterKeyPressRegister(event));

document.getElementById("btn-register").addEventListener("click", registerKeyPress);

function registerKeyPress() {

    let data;
    if (fs.existsSync(filename)) {
        data = fs.readFileSync(filename, 'utf8').split('\n');
    } else {
        data = "";
    }

    const username = $("#txtUsr").val().trim();
    const pass = $("#txtPwd").val();
    const repeat = $("#txtRepeat").val();

    for (let i = 0; i < data.length; i++) {
        const user = data[i].split(',')[0].split(':')[1].trim();
        if (user.toLowerCase() == username.toLowerCase()) {
            $("#lbl").text("Le nom d'utilisateur existe déjà.");
            return;
        }
    }

    if (pass.length < 8) {
        $("#lbl").html("Entrez au moins 8 caractères<br>pour le mot de passe.");
        return;
    }

    if (pass !== repeat) {
        $("#lbl").html("Les mots de passe ne<br>correspondent pas.");
        return;
    }

    data.push("user:" + username + ",password:" + pass);
    const newData = data.join('\n');
    fs.writeFileSync(filename, newData);

    ipc.sendSync('entry-accepted', username);
}

function enterKeyPressRegister(event) {
    if (event.key !== "Enter") return;
    document.getElementById("btn-register").click();
    event.preventDefault();
}
