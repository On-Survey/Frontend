import {
	type Analytics,
	getAnalytics,
	isSupported,
	logEvent,
} from "firebase/analytics";
import { type FirebaseApp, getApps, initializeApp } from "firebase/app";

let app: FirebaseApp | null = null;
let analyticsInstance: Analytics | null = null;

const firebaseConfig = {
	apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
	authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
	projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
	storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
	messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
	appId: import.meta.env.VITE_FIREBASE_APP_ID,
	measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const isBrowser = typeof window !== "undefined";

export const initFirebase = async () => {
	if (!isBrowser) return null;

	if (analyticsInstance) return analyticsInstance;

	if (!firebaseConfig.apiKey || !firebaseConfig.appId) {
		return null;
	}

	if (!getApps().length) {
		app = initializeApp(firebaseConfig);
	} else {
		app = getApps()[0]!;
	}

	const supported = await isSupported();
	if (!supported) return null;

	analyticsInstance = getAnalytics(app);
	return analyticsInstance;
};

export const logFirebaseEvent = async (
	eventName: string,
	params?: Record<string, unknown>,
) => {
	const analytics = await initFirebase();
	if (!analytics) return;

	logEvent(analytics, eventName, params);
};

export const logPageView = async (path: string) => {
	await logFirebaseEvent("page_view", {
		page_path: path,
	});
};
