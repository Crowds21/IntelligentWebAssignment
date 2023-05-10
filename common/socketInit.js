// Export a function that initializes the socket.io server with event listeners
exports.init = function(io) {
    // Event listener for new connections to the server
    io.sockets.on('connection', function (socket) {
        console.log("New client connected");
        try {
            // Event listener for 'create or join' event
            // joins a socket room and emits a 'joined' event to all clients in the room
            socket.on('create or join', function (room, userId) {
                socket.join(room);
                io.sockets.to(room).emit('joined', room, userId);
            });

            // Event listener for 'chat' event, emits a 'chat' event to all clients in the room
            socket.on('chat', function (room, userId, chatText) {
                io.sockets.to(room).emit('chat', room, userId, chatText);
            });

            // Event listener for 'disconnect' event, logs a message when a client disconnects
            socket.on('disconnect', function(){
                console.log('Client disconnected');
            });
        } catch (e) {
            // Catch any error and logs that error
            console.log("error occured: " + e)
        }
    });
}
