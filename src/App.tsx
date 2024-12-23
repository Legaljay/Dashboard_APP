import React from "react";

import { Providers } from './providers';
import { ThemeProvider } from './contexts/ThemeContext';
import { ToastProvider } from "./contexts/ToastContext";
import { RouterProvider } from "./providers/RouterProvider";

import "./App.css";




function App() {
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
