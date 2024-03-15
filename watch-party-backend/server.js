const express =  require('express');

const app  = express();
const dotEnv  = require("dotenv").config();
const port = process.env.PORT |  5000;
app.listen(port, () => {
    console.log(`server running on port ${port}`);
})


const io = require('socket.io')(3001, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET","POST"],
    }
})


io.on('connection', socket => {
    socket.on("changing_timeline", timelineData => {
        console.log("timeline data",timelineData);
        timelineData.operation = 'seek';
        socket.broadcast.emit("timline_changed",timelineData);
    });
    socket.on("pausing_timeline", timelineData => {
        console.log("pausing_timeline",timelineData);
        timelineData.operation = 'pause';
        socket.broadcast.emit("timline_changed",timelineData);
    })
    socket.on("playing_timeline", timelineData => {
        console.log("playing_timeline",timelineData);
        timelineData.operation = 'play';
        socket.broadcast.emit("timline_changed",timelineData);
    })
    

})