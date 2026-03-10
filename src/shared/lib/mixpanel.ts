import mixpanel from "mixpanel-browser";

type MixpanelLike = {
	track: (event: string, properties?: Record<string, unknown>) => void;
};

declare global {
	interface Window {
		mixpanel?: MixpanelLike;
	}
}

const MIXPANEL_TOKEN = import.meta.env.VITE_MIXPANEL_TOKEN;

let isInitialized = false;

const initMixpanel = () => {
	if (typeof window === "undefined") return;
	if (isInitialized) return;
	if (!MIXPANEL_TOKEN) {
		if (import.meta.env.DEV) {
			console.warn("Mixpanel token is not set");
		}
		return;
	}

	mixpanel.init(MIXPANEL_TOKEN, {
		debug: import.meta.env.DEV,
		autocapture: true,
		record_sessions_percent: 100,
	});

	window.mixpanel = mixpanel;
	isInitialized = true;
};

export const trackEvent = (
	event: string,
	properties?: Record<string, unknown>,
): void => {
	if (typeof window === "undefined") return;

	if (!isInitialized) {
		initMixpanel();
	}

	if (!window.mixpanel || typeof window.mixpanel.track !== "function") {
		return;
	}

	window.mixpanel.track(event, properties);
};

export const identifyUser = (userId: string): void => {
	if (typeof window === "undefined") return;

	if (!isInitialized) {
		initMixpanel();
	}

	const mp = window.mixpanel as unknown as {
		identify?: (id: string) => void;
	};

	if (!mp || typeof mp.identify !== "function") {
		return;
	}

	mp.identify(userId);
};
