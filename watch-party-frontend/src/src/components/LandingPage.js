import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

import { useNavigate } from "react-router-dom";

function LandingPage() {
  const navigate = useNavigate();

  const [socket, setSocket] = useState();
  const [roomId, setRoomId] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const s = io("http://localhost:3001");
    setSocket(s);
  }, []);

  const joinRoom = () => {
    if (!roomId) {
      setMsg("Please Enter a Room ID!");
      return;
    }
    
    socket.emit("join_room", { room: roomId }, (response) => {
      if (response.success) {
        console.log(response.message);
        navigate(`/room/${roomId}`);
      } else {
        console.log(response.message);
        setMsg(response.message);
      
      }
    });
  };
    
    // setRoomId(roomId);
 
  const generateRoomId = () => {
    const roomId = Math.random().toString(36).substring(7);
    return roomId;
  };
  const createRoom = () => {
    const newRoomId = generateRoomId(); // Generate a new room ID
    socket.emit("new_room",{userName:"kd",room:newRoomId});
    navigate(`/room/${newRoomId}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="max-w-xl w-full p-6 rounded-lg shadow-md border-2 border-red-500 bg-black">
        <h2 className="text-3xl font-extrabold text-red-900 text-center mb-8">
          Watch Party
        </h2>
        <div class="grid grid-cols-4 gap-4">
          <div class="col-span-1">
            <button
              className="w-full bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="button"
              onClick={createRoom}
            >
              New Room
            </button>
          </div>

          <div class="col-span-2">
            <div class="md:flex md:items-center mb-6">
              <input
                class="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500 "
                id="roomid"
                type="text"
                value={roomId}
                onChange={(e) => {
                  setRoomId(e.target.value);
                }}
              ></input>
            </div>
          </div>

          <div class="col-span-1">
            <button
              className="w-full bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="button"
              onClick={joinRoom}
            >
              Join
            </button>
          </div>
        </div>
        {/* <div className="mb-4">
          <button
            className="w-full bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="button"
          >
            Join a Room
          </button>
        </div>
        <div className="mb-6">
          <button
            className="w-full bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="button"
          >
            Create a Room
          </button>
        </div> */}
        {/* <p className="text-sm text-gray-600 text-center">
          Or{" "}
          <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
            sign in
          </a>{" "}
          to an existing room
        </p> */}
        <p style={{ color: "white" }}>{msg}</p>
      </div>
    </div>
  );
}

export default LandingPage;
