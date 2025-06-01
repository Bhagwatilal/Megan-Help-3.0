import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';

interface CallServiceProps {
  isVideoCall: boolean;
  recipientData: {
    id: string;
    name: string;
    avatar: string;
  };
  onEndCall: () => void;
}

// Simulated WebRTC connections for demo
const CallService: React.FC<CallServiceProps> = ({ isVideoCall, recipientData, onEndCall }) => {
  const [isConnecting, setIsConnecting] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const callTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Simulate call connection
  useEffect(() => {
    const connectTimeout = setTimeout(() => {
      setIsConnecting(false);
      setIsConnected(true);
      
      // Start timer for call duration
      callTimerRef.current = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
      
      toast.success(`${isVideoCall ? 'Video' : 'Audio'} call connected with ${recipientData.name}`);
      
      // Simulate accessing camera for local video
      if (isVideoCall && localVideoRef.current) {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
          .then(stream => {
            if (localVideoRef.current) {
              localVideoRef.current.srcObject = stream;
              
              // For demo, we'll use the same stream for remote video with a delay
              setTimeout(() => {
                if (remoteVideoRef.current) {
                  remoteVideoRef.current.srcObject = stream;
                }
              }, 1000);
            }
          })
          .catch(err => {
            console.error("Error accessing camera:", err);
            toast.error("Could not access camera or microphone");
          });
      }
    }, 2000);
    
    return () => {
      clearTimeout(connectTimeout);
      if (callTimerRef.current) {
        clearInterval(callTimerRef.current);
      }
      
      // Clean up media streams when component unmounts
      if (localVideoRef.current && localVideoRef.current.srcObject) {
        const stream = localVideoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isVideoCall, recipientData.name]);
  
  const toggleMute = () => {
    setIsMuted(prev => !prev);
    
    // In a real implementation, this would mute the audio track
    if (localVideoRef.current && localVideoRef.current.srcObject) {
      const stream = localVideoRef.current.srcObject as MediaStream;
      stream.getAudioTracks().forEach(track => {
        track.enabled = isMuted; // Toggle to opposite of current state
      });
    }
    
    toast.info(isMuted ? "Microphone unmuted" : "Microphone muted");
  };
  
  const toggleVideo = () => {
    if (!isVideoCall) return;
    
    setIsVideoOff(prev => !prev);
    
    // In a real implementation, this would disable the video track
    if (localVideoRef.current && localVideoRef.current.srcObject) {
      const stream = localVideoRef.current.srcObject as MediaStream;
      stream.getVideoTracks().forEach(track => {
        track.enabled = isVideoOff; // Toggle to opposite of current state
      });
    }
    
    toast.info(isVideoOff ? "Camera turned on" : "Camera turned off");
  };
  
  const handleEndCall = () => {
    // Stop all media tracks
    if (localVideoRef.current && localVideoRef.current.srcObject) {
      const stream = localVideoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
    
    toast.info(`Call ended after ${formatDuration(callDuration)}`);
    onEndCall();
  };
  
  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  return (
    <div className="relative h-full flex flex-col">
      {/* Video containers */}
      {isVideoCall && (
        <div className="relative flex-1 bg-black overflow-hidden">
          {/* Remote video (full screen) */}
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className={`w-full h-full object-cover ${isConnecting ? 'hidden' : 'block'}`}
          />
          
          {/* Local video (picture-in-picture) */}
          <div className="absolute bottom-4 right-4 w-1/4 max-w-[120px] rounded-lg overflow-hidden shadow-lg border-2 border-white">
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className={`w-full h-full object-cover ${isVideoOff ? 'bg-gray-800' : ''}`}
            />
            {isVideoOff && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                <span className="text-white text-xs">Camera off</span>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Audio call UI (when not video) */}
      {!isVideoCall && (
        <div className="flex-1 flex flex-col items-center justify-center bg-gradient-to-b from-mentii-100 to-lavender-50">
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-white shadow-lg mb-4">
            <img 
              src={recipientData.avatar} 
              alt={recipientData.name}
              className="w-full h-full object-cover"
            />
          </div>
          <h2 className="text-xl md:text-2xl font-semibold mb-2">{recipientData.name}</h2>
          
          {isConnecting ? (
            <p className="text-mentii-600">Connecting...</p>
          ) : (
            <div className="flex items-center text-mentii-600">
              <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
              <p>{formatDuration(callDuration)}</p>
            </div>
          )}
        </div>
      )}
      
      {/* Call controls */}
      <div className="p-4 bg-white border-t flex items-center justify-center space-x-4">
        <button
          onClick={toggleMute}
          className={`rounded-full p-3 ${isMuted ? 'bg-red-100 text-red-600' : 'bg-gray-200 text-gray-700'}`}
        >
          {isMuted ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="1" y1="1" x2="23" y2="23"></line>
              <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"></path>
              <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"></path>
              <line x1="12" y1="19" x2="12" y2="23"></line>
              <line x1="8" y1="23" x2="16" y2="23"></line>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
              <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
              <line x1="12" y1="19" x2="12" y2="23"></line>
              <line x1="8" y1="23" x2="16" y2="23"></line>
            </svg>
          )}
        </button>
        
        {isVideoCall && (
          <button
            onClick={toggleVideo}
            className={`rounded-full p-3 ${isVideoOff ? 'bg-red-100 text-red-600' : 'bg-gray-200 text-gray-700'}`}
          >
            {isVideoOff ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 16v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2m5.66 0H14a2 2 0 0 1 2 2v3.34l1 1L23 7v10"></path>
                <line x1="1" y1="1" x2="23" y2="23"></line>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="23 7 16 12 23 17 23 7"></polygon>
                <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
              </svg>
            )}
          </button>
        )}
        
        <button
          onClick={handleEndCall}
          className="rounded-full p-4 bg-red-500 text-white"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7 2 2 0 0 1 1.72 2v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.42 19.42 0 0 1-3.33-2.67m-2.67-3.34a19.79 19.79 0 0 1-3.07-8.63A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91"></path>
            <line x1="22" y1="2" x2="2" y2="22"></line>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default CallService;
