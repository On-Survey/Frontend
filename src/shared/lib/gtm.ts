declare global {
	interface Window {
		dataLayer?: unknown[];
	}
}

interface GtmEventParams {
	event: string;
	pagePath?: string;
	[key: string]: unknown;
}

/**
 * Google Tag Manager에 이벤트를 전송하는 유틸 함수
 * @param params - 이벤트 파라미터
 * @param params.event - 이벤트 이름 (필수)
 * @param params.pagePath - 페이지 경로 (선택, 없으면 현재 경로 사용)
 * @param params - 기타 추가 파라미터들 (source, step, status 등)

 */
export const pushGtmEvent = (params: GtmEventParams): void => {
	if (typeof window === "undefined") return;

	window.dataLayer = window.dataLayer || [];

	const { event, pagePath, ...restParams } = params;

	const gtmData = {
		event,
		page_path: pagePath ?? window.location.pathname + window.location.search,
		...restParams,
	};

	window.dataLayer.push(gtmData);
};
