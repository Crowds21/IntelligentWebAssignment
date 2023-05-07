let name = null;
let roomNo = null;
let socket = io();

/**
 * called by <body onload>
 * it initialises the interface and the expected socket messages
 * plus the associated actions
 */
async function initChatRoom() {
    const path = window.location.pathname;
    roomNo = path.substring(path.lastIndexOf("/") + 1);
    let user = await isDataExist(user_store);
    name = user.username
    // When someone joined
    socket.on('joined', function (room, userId) {
        if (userId === name) {
            // If it is user self

        } else {
            // notifies that someone has joined the room

        }
    });
    // List who send the msg
    socket.on('chat', function (room, userId, content) {
            writeOnHistory(userId,content);
    });

}

/**
 * called when the Send button is pressed. It gets the text to send from the interface
 * and sends the message via  socket
 */
function sendChatText(content) {
    socket.emit('chat', roomNo, name, content);
}

/**
 * used to connect to a room. It gets the user name and room number from the
 * interface
 */
function connectToRoom() {
    if (!name) name = 'Unknown-' + Math.random();
    socket.emit('create or join', roomNo, name);
}

/**
 * it appends the given html text to the history div
 * @param user Username
 * @param date Date of sending msg
 * @param content Content of msg
 */
function writeOnHistory(user,content) {
    let chatTemplate = `<div class="container even"><div class="row table-secondary"><div class="col-md-3"><h2 class="username-style">${user}</h2><div class="row">
                    <div class="col-md-3 py-4"></div>
                    </div></div>
                <div class="col-md-8 py-4"><p class="description-style">${content}</p></div></div></div>`
    let history = document.getElementById('chat_board_container');
    const parser = new DOMParser();
    let chatHtml = parser.parseFromString(chatTemplate, 'text/html');
    const chatNode = chatHtml.body.firstChild;
    history.appendChild(chatNode)
    document.getElementById('chat_input').value = '';
}


