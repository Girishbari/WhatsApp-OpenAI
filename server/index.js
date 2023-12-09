const express = require("express");
const cors = require("cors")
const { createServer } = require('node:http');
const { Server } = require('socket.io');
const path = require('path')
const  router = require("./router/routes");
const socketlogic = require("./socket")

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*", // needs to change on AWS server
        methods: ["GET", "POST"]
    }
});


const port = 3000;
app.use(cors({
    origin: '*'
}))

app.use(cors());
app.use("/api", router)

socketlogic(io)

server.listen(port, () => {
    console.log("listening on :", port);
})

