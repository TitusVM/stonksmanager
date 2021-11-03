let $ = require('jquery')
let fs = require('fs')
let filename = 'users'
const ipc = require('electron').ipcRenderer;
const { app } = require('electron');

$('#btn-login').on('click', () => {

    if (fs.existsSync(filename)) {
        let data = fs.readFileSync(filename, 'utf8').split('\n')


        data.forEach((authorities, index) => {
            let [user, password] = authorities.split(',')
            console.log(user)
            console.log(password)
            let [name1, usr] = user.split(':')
            let [name2, pass] = password.split(':')

            let txtUser = $('#txtUsr').val();
            let txtPwd = $('#txtPwd').val();

            if (txtUser == usr && txtPwd == pass) {
                ipc.sendSync('entry-accepted', 'ping')
            }
            else {
                $('#lbl').text('username or password is incorrect')
            }
        })
    }
})

$('#btn-quit').on('click', () => {
    ipc.send('login_close-me')
})