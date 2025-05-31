import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Initialize root and render app
const container = document.getElementById("root");
if (!container) throw new Error("Root element not found");

const root = createRoot(container);
root.render(<App />);
