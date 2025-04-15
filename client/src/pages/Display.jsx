import React from "react";
import Nav from "./components/Nav";
import Main from "./main/Main";
import { Toaster } from "sonner";

function Display() {
  return (
    <div className="display">
      <Nav />
      <Main />

      <Toaster position="top-center" richColors duration={2500} />
    </div>
  );
}

export default Display;
