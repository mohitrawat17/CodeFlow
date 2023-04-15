// const { log } = require('console');
const express = require('express')
const app = express()

const http = require('http')
const server = http.createServer(app);

const { Server } = require('socket.io');
const ACTIONS = require('./src/Actions')
const io = new Server(server)
const userSocketMap = {}


function getAllConnectedClients(editorId) {
    // Map
    return Array.from(io.sockets.adapter.rooms.get(editorId) || []).map(
        (socketId) => {
            return {
                socketId,
                username: userSocketMap[socketId],
            };
        }
    );
}







//connecting to socket
io.on('connection', (socket) => {
    console.log('socket connected', socket.id);

    socket.on(ACTIONS.JOIN, ({ editorId, username }) => {

        //mapping
        userSocketMap[socket.id] = username;
        socket.join(editorId);
        const clients = getAllConnectedClients(editorId);
        console.log(clients);
        clients.forEach(({ socketId }) => {
            io.to(socketId).emit(ACTIONS.JOINED, {
                clients,
                username,
                socketId: socket.id,
            })
        });
    });

    // syncing code when code is changed by anyone
    socket.on(ACTIONS.CODE_CHANGE, ({ editorId, code }) => {
        socket.in(editorId).emit(ACTIONS.CODE_CHANGE, { code });
    })

    //syncing code for the new user
    socket.on(ACTIONS.SYNC_CODE, ({ socketId, code }) => {
        io.to(socketId).emit(ACTIONS.CODE_CHANGE, { code });
    })



    socket.on('disconnecting', () => {
        const rooms = [...socket.rooms];
        rooms.forEach((editorId) => {
            socket.in(editorId).emit(ACTIONS.DISCONNECTED, {
                socketId: socket.id,
                username: userSocketMap[socket.id],
            });
        });
        delete userSocketMap[socket.id];
        socket.leave();
    });

})
// starting server
const PORT = process.env.PORT || 3500;
server.listen(PORT, () => console.log(`listening on ${PORT}`));