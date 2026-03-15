/**
 * 구글폼 URL 여부 검사 (빈 문자열은 통과)
 */
export const isGoogleFormLinkUrl = (v: string): boolean =>
	!v ||
	v.startsWith("https://docs.google.com/forms") ||
	v.startsWith("https://docs.google.com/forms/") ||
	v.startsWith("https://docs.google.com/");

/**
 * 가격을 한국어 천 단위 포맷 (소수 없음)
 */
export const formatPrice = (price: number): string =>
	price.toLocaleString("ko-KR", { maximumFractionDigits: 0 });

/**
 * Date → "YYYY.MM.DD"
 */
export const formatDate = (date: Date): string => {
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");
	return `${year}.${month}.${day}`;
};

/**
 * Date → "YYYY-MM-DD" (ISO 날짜만)
 */
export const formatDateToISO = (date: Date): string => {
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");
	return `${year}-${month}-${day}`;
};

/**
 * 기본 마감일: 오늘 기준 7일 후
 */
export const getDefaultDeadline = (): Date => {
	const today = new Date();
	const sevenDaysLater = new Date(today);
	sevenDaysLater.setDate(today.getDate() + 7);
	return sevenDaysLater;
};
