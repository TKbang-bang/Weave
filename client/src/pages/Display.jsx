import React, { createContext, useMemo } from "react";
import Nav from "./components/Nav";
import Main from "./main/Main";
import { Toaster } from "sonner";
import io from "socket.io-client";

export const SocketContext = createContext(null);

function Display() {
  const socket = useMemo(() => io(`${import.meta.env.VITE_BACKEND_URL}`), []);

  return (
    <SocketContext.Provider value={socket}>
      <div className="display">
        <Nav />
        <Main />
      </div>
    </SocketContext.Provider>
  );
}

export default Display;
