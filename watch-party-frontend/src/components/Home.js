import { React, useRef, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {io} from 'socket.io-client'
function Home() {
  const { roomId } = useParams();
  const selectedVideo = require("../media/bike.mp4");

  const videoRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [videoControl,setVideoControl] = useState(true);
  const [socket, setSocket] = useState();
  const [userId,setUserId] = useState();
 
  useEffect(() => {
    const s = io("http://localhost:3001");
    setSocket(s);
    console.log("socket", s);
    setUserId(Math.random() * 10);
    return () => {
      s.disconnect();
    };
  }, []);

  useEffect(() => {
    if(socket == null) return;
    
    socket.on("timline_changed",handleRemoteTimelineChange)
    
    return () => {
      socket.off('timline_changed',handleRemoteTimelineChange);
    }
  },[socket] )


  // const handleSeek = (timeLineData) => {
  //   console.log("timeline changed",timeLineData);

  //     setVideoControl(false);
  //     videoRef.current.currentTime = timeLineData.currentTime;
  //     setVideoControl(true);
  //   //   // setCurrentTime(time);
    
  // };

  

  const handleRemoteTimelineChange = (timeLineData) => {
    // Update the timeline only if the change was initiated locally
    console.log('remote change',timeLineData);
    if(timeLineData.operation === 'play') 
    {
      if(parseFloat(videoRef.current.currentTime) === parseFloat(timeLineData.currentTime)) return;
      videoRef.current.play();
    } 
    if(timeLineData.operation === 'pause') 
    {
      if(parseFloat(videoRef.current.currentTime) === parseFloat(timeLineData.currentTime)) return;
      videoRef.current.pause();
    }
    else 
    {
      if(Math.abs(parseFloat(videoRef.current.currentTime) - parseFloat(timeLineData.currentTime)) < 0.9) return;
      videoRef.current.currentTime = timeLineData.currentTime;
    }
    
  };


  const handleSeeking = (e,operation) => {
    let currentTime = videoRef.current.currentTime;
    
    if(operation === 'seeking')
    {
      socket.emit("changing_timeline", { currentTime ,userId, operation
      });
      console.log(operation);
    }
   else if(operation === 'pause')
    {
      socket.emit("pausing_timeline", { currentTime ,userId, operation
      });
      console.log(operation);
    }
    else if(operation === 'play')
    {
      socket.emit("playing_timeline", { currentTime ,userId, operation
      });
      console.log(operation);
    }
    
    // console.log("seeking", currentTime);
    
  };


 

  return (
    <>
    <div className="bg-black min-h-screen">

    <div>
      <p className="text-white font-bold text-center ">Room ID: {roomId}</p>
        
        
      </div>
    <div class="grid grid-cols-4 gap-4">
    <div class="col-span-3 ">
    <video
          ref={videoRef}
          controls
          src={selectedVideo}
          width="100%"
          height="300"
          onSeeking={(e) => {handleSeeking(e,'seeking')}}
          onPause={(e) => {handleSeeking(e,'pause')}}
          onPlay={(e) => {handleSeeking(e,'play')}}
          className="m-10 border border-red-500 rounded-lg shadow-lg"
          
        ></video>

      </div>

    </div>

    </div>
   
    
  
      
    </>
  );
}

export default Home;
