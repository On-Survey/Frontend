type MixpanelLike = {
	track: (event: string, properties?: Record<string, unknown>) => void;
};

declare global {
	interface Window {
		mixpanel?: MixpanelLike;
	}
}

export const trackEvent = (
	event: string,
	properties?: Record<string, unknown>,
): void => {
	if (typeof window === "undefined") return;

	if (!window.mixpanel || typeof window.mixpanel.track !== "function") {
		return;
	}

	window.mixpanel.track(event, properties);
};
