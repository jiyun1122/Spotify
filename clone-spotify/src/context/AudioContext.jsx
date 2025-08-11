import { createContext, useState } from "react";

export const AudioContext = createContext();

export const AudioProvider = ({children}) => {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  return (
    <AudioContext.Provider
      value={{currentTrack,setCurrentTrack,isVisible,setIsVisible}}
    >
      {children}
    </AudioContext.Provider>
  )
}