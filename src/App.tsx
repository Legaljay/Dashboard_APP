import React, { useEffect } from "react";

import { Providers } from "./providers";
import { ThemeProvider } from "./contexts/ThemeContext";
import { ToastProvider } from "./contexts/ToastContext";
import { RouterProvider } from "./providers/RouterProvider";

import "./App.css";
import { initSmoothScroll } from "./utils/smoothScroll";

function App() {

  useEffect(() => {
    initSmoothScroll();
  }, []);

  return (
    <ThemeProvider>
      <Providers>
        <ToastProvider>
          <RouterProvider />
        </ToastProvider>
      </Providers>
    </ThemeProvider>
  );
}

export default App;
