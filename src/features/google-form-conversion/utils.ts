import type { Interest } from "@features/create-survey/service/form/types";
import type {
	AgeCode,
	GenderCode,
	RegionCode,
} from "@features/payment/constants/payment";
import type { InterestId } from "@shared/constants/topics";
import { topics } from "@shared/constants/topics";
import { isoDateToEndOfDayLocal } from "@shared/lib/FormatDate";
import { validateEmail } from "@shared/lib/validators";
import axios from "axios";
import {
	GOOGLE_FORM_CONVERSION_PRICE_TABLE,
	GOOGLE_FORM_CONVERSION_PROMO_PRICE_TABLE,
	TARGETING_CASE_ORDER,
} from "./constants";
import type {
	CreateGoogleFormConversionRequestBody,
	FormRequestValidationResponse,
	GoogleFormSurveyFormRequest,
} from "./service/api";
import type {
	GoogleFormConversionScreeningDraft,
	QuestionRange,
	RespondentCount,
	TargetingCase,
} from "./types";

/** 관심사 다중 선택 값을 필드 표시용 문자열로 */
export const formatInterestSelectionDisplay = (ids: InterestId[]): string => {
	if (ids.length === 0) return "";
	const names = ids.map(
		(id) => topics.find((t) => t.id === id)?.name ?? String(id),
	);
	if (names.length <= 2) return names.join(", ");
	return `${names.slice(0, 2).join(", ")} 외 ${names.length - 2}`;
};

/**
 * 구글폼 URL 여부 검사 (빈 문자열은 통과)
 */
export const isGoogleFormLinkUrl = (v: string): boolean =>
	!v ||
	v.startsWith("https://docs.google.com/forms") ||
	v.startsWith("https://docs.google.com/forms/") ||
	v.startsWith("https://docs.google.com/");

/**
 * 구글폼 플로우: 이메일 필수 + 형식 검사.
 * 공용 {@link validateEmail}은 빈 문자열을 허용하므로 이 플로우에서만 사용한다.
 */
export const isGoogleFormConversionContactEmail = (email: string): boolean => {
	const trimmed = email.trim();
	return trimmed.length > 0 && validateEmail(trimmed);
};

/** POST /v1/form-requests/validation 등 4xx 응답 본문 (예: FORM_REQUEST_003) */
export type FormRequestApiErrorBody = {
	code?: string;
	message?: string;
	success?: boolean;
	result?: unknown;
};

/**
 * 폼 요청 검증 API 실패 시 서버 `message`를 우선 사용 (400 등, 재시도 없이 토스트용)
 */
export const getFormRequestValidationErrorMessage = (
	error: unknown,
): string => {
	if (axios.isAxiosError(error)) {
		const data = error.response?.data as FormRequestApiErrorBody | undefined;
		if (
			data &&
			typeof data === "object" &&
			typeof data.message === "string" &&
			data.message.trim().length > 0
		) {
			return data.message;
		}
	}
	if (error instanceof Error && error.message) return error.message;
	return "검증에 실패했어요. 잠시 후 다시 시도해주세요";
};

/** POST /v1/form-requests/validation 성공 응답에서 변환 가능 문항 수 합계 */
export const getConvertibleQuestionCountFromValidation = (
	res: FormRequestValidationResponse,
): number =>
	res.result.results.reduce((sum, item) => sum + item.convertible, 0);

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

export type BuildGoogleFormConversionRequestInput = {
	formLink: string;
	requesterEmail: string;
	respondentCount: RespondentCount;
	gender: GenderCode;
	ages: AgeCode[];
	residence: RegionCode;
	deadlineIsoDate: string;
	/** 실제 결제 금액 */
	paidTotalCoin: number;
	discountCode?: string | null;
	interests: Interest[];
	screening?: GoogleFormConversionScreeningDraft | null;
};

/** POST /v1/form-requests 요청 바디 조립 — 금액은 화면에서 계산한 총 결제액만 `dueCountPrice`·`totalCoin`에 동일 반영 */
export const buildGoogleFormConversionCreateRequestBody = (
	input: BuildGoogleFormConversionRequestInput,
): CreateGoogleFormConversionRequestBody => {
	const paid = input.paidTotalCoin;

	const surveyForm: GoogleFormSurveyFormRequest = {
		deadline: isoDateToEndOfDayLocal(input.deadlineIsoDate),
		gender: input.gender,
		ages: input.ages,
		residence: input.residence,
		dueCount: input.respondentCount,
		dueCountPrice: paid,
		totalCoin: paid,
		...(input.discountCode?.trim() && {
			discountCode: input.discountCode.trim(),
		}),
	};

	const body: CreateGoogleFormConversionRequestBody = {
		formLink: input.formLink.trim(),
		requesterEmail: input.requesterEmail.trim(),
		surveyForm,
	};

	if (
		input.screening?.question?.trim() &&
		typeof input.screening.answer === "boolean"
	) {
		body.screening = {
			content: input.screening.question.trim(),
			answer: input.screening.answer,
		};
	}

	if (input.interests.length > 0) {
		body.interests = input.interests;
	}

	return body;
};
