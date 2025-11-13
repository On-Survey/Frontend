/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_API_BASE_URL: string;
	readonly VITE_SENTRY_DSN: string;
	// 다른 환경변수들을 여기에 추가하세요
}

export interface ImportMeta {
	readonly env: ImportMetaEnv;
}
