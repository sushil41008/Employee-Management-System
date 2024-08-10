import { Toaster } from "@/components/ui/toaster";
import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";
import DraggableProvider from "./hooks/draggable-provider";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <DraggableProvider>
            <App />
        </DraggableProvider>
        <Toaster />
    </React.StrictMode>
);
