import { createRoot } from "react-dom/client";
import "./index.css";
import Clarity from "@microsoft/clarity";
import * as Sentry from "@sentry/react";
import { TDSMobileAITProvider } from "@toss/tds-mobile-ait";
import { App } from "./App.tsx";

// Microsoft Clarity 초기화 (index.html 스크립트로 이미 로드됨, identify 등 고급 기능용)
Clarity.init("vch34g8dh3");

Sentry.init({
	dsn: import.meta.env.VITE_SENTRY_DSN,
	sendDefaultPii: true,
});

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Root element not found");

createRoot(rootElement).render(
	<TDSMobileAITProvider>
		<App />
	</TDSMobileAITProvider>,
);
