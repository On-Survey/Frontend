/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_API_BASE_URL: string;
	readonly VITE_SENTRY_DSN: string;
	/** 구글폼 인앱: 금액(원 문자열) → SKU JSON. 키는 판매가(20350) 권장, 공급가(18500)도 조회됨 */
	readonly VITE_GOOGLE_FORM_IAP_SKU_BY_PRICE?: string;
	// 다른 환경변수들을 여기에 추가하세요
}

export interface ImportMeta {
	readonly env: ImportMetaEnv;
}
