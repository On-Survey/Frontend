import type { AgeCode, GenderCode } from "@features/payment/constants/payment";
import {
	GOOGLE_FORM_CONVERSION_PRICE_TABLE,
	GOOGLE_FORM_CONVERSION_PROMO_PRICE_TABLE,
	TARGETING_CASE_ORDER,
} from "./constants";
import type { QuestionRange, RespondentCount, TargetingCase } from "./types";

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

/**
 * 문항 수 → 문항 구간 (1~30 / 31~50)
 * null이거나 미입력 시 1~30 구간으로 간주
 */
export const getQuestionRange = (
	questionCount: number | null,
): QuestionRange => {
	if (questionCount == null || questionCount <= 30) return "1_30";
	return "31_50";
};

/**
 * 성별·연령 선택 → 타게팅 케이스
 */
export const getTargetingCase = (
	gender: GenderCode,
	ages: AgeCode[],
): TargetingCase => {
	const isAllAges =
		ages.length === 0 || (ages.length === 1 && ages[0] === "ALL");
	const isSingleAge = ages.length === 1 && ages[0] !== "ALL";
	const isMultiAge = ages.length > 1;
	const isAllGender = gender === "ALL";
	const isSingleGender = gender === "MALE" || gender === "FEMALE";

	if (isAllGender && isAllAges) return "no_targeting";
	if (isSingleGender && isAllAges) return "single_gender_all_age";
	if (isAllGender && isMultiAge) return "all_gender_multi_age";
	if (isSingleGender && isMultiAge) return "single_gender_multi_age";
	if (isAllGender && isSingleAge) return "all_gender_single_age";
	return "single_gender_single_age";
};

/**
 * 구글폼 변환 판매가 조회 (응답자 수 · 문항 구간 · 타게팅 케이스)
 */
export const getGoogleFormConversionPrice = (
	respondentCount: RespondentCount,
	questionRange: QuestionRange,
	targetingCase: TargetingCase,
): number => {
	const prices =
		GOOGLE_FORM_CONVERSION_PRICE_TABLE[respondentCount][questionRange];
	const index = TARGETING_CASE_ORDER.indexOf(targetingCase);
	return index >= 0 ? (prices[index] ?? prices[0]) : prices[0];
};

/**
 * 구글폼 변환 프로모션 판매가 조회 (프로모션 코드 승인 시 적용)
 */
export const getGoogleFormConversionPromoPrice = (
	respondentCount: RespondentCount,
	questionRange: QuestionRange,
	targetingCase: TargetingCase,
): number => {
	const prices =
		GOOGLE_FORM_CONVERSION_PROMO_PRICE_TABLE[respondentCount][questionRange];
	const index = TARGETING_CASE_ORDER.indexOf(targetingCase);
	return index >= 0 ? (prices[index] ?? prices[0]) : prices[0];
};
