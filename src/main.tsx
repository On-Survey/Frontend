import { createRoot } from "react-dom/client";
import "./index.css";
import * as Sentry from "@sentry/react";
import { App } from "./App.tsx";

Sentry.init({
	dsn: import.meta.env.VITE_SENTRY_DSN,
	sendDefaultPii: true,
});

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Root element not found");

createRoot(rootElement).render(<App />);
