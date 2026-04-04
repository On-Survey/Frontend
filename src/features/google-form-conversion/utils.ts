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
	type CreateRequestBody,
	type FormRequestValidationResponse,
	type FormRequestValidationSuccessResultItem,
	type GoogleFormSurveyFormRequest,
	isFormRequestValidationSuccessResultItem,
} from "./service/api";
import type { QuestionRange, RespondentCount, ScreeningDraft } from "./types";

/** 관심사 다중 선택 값을 필드 표시용 문자열로 */
export const formatInterestSelectionDisplay = (ids: InterestId[]): string => {
	if (ids.length === 0) return "";
	const names = ids.map(
		(id) => topics.find((t) => t.id === id)?.name ?? String(id),
	);
	if (names.length <= 2) return names.join(", ");
	return `${names.slice(0, 2).join(", ")} 외 ${names.length - 2}`;
};

const GOOGLE_FORM_EDIT_LINK_REGEX =
	/^https:\/\/docs\.google\.com\/forms\/d\/[A-Za-z0-9_-]+\/edit(?:\?.*)?$/;
const GOOGLE_FORM_RESPONDENT_LINK_REGEX =
	/^https:\/\/docs\.google\.com\/forms\/d\/e\/[A-Za-z0-9_-]+\/viewform(?:\?.*)?$/;

/** 제출 가능한 구글폼 편집 링크(`.../forms/d/{id}/edit`) 여부 */
export const isGoogleFormLinkUrl = (v: string): boolean =>
	GOOGLE_FORM_EDIT_LINK_REGEX.test(v.trim());

/** 응답자용 링크(`.../forms/d/e/{id}/viewform`) 여부 */
export const isGoogleFormRespondentLinkUrl = (v: string): boolean =>
	GOOGLE_FORM_RESPONDENT_LINK_REGEX.test(v.trim());

/** 구글폼 링크 입력 유효성 메시지 (통과 시 null) */
export const getGoogleFormLinkValidationMessage = (
	v: string,
): string | null => {
	const trimmed = v.trim();
	if (!trimmed) return null;
	if (isGoogleFormRespondentLinkUrl(trimmed)) {
		return "응답자용 링크(viewform) 말고 편집 링크(edit)를 입력해주세요";
	}
	if (!isGoogleFormLinkUrl(trimmed)) {
		return "편집 가능한 구글폼 링크(.*/edit)만 입력할 수 있어요";
	}
	return null;
};

/**
 * 구글폼 플로우: 이메일 필수 + 형식 검사.
 * 공용 {@link validateEmail}은 빈 문자열을 허용하므로 이 플로우에서만 사용한다.
 */
export const isContactEmail = (email: string): boolean => {
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
	res.result.results.reduce(
		(sum, item) =>
			sum +
			(isFormRequestValidationSuccessResultItem(item) ? item.convertible : 0),
		0,
	);

/**
 * 가격표 문항 구간용 총 문항 수.
 * `totalCount`가 0으로 오는 경우가 있어 `convertible`·미변환 목록 길이로 보정한다.
 */
export const getTotalQuestionCountForPricing = (
	success: FormRequestValidationSuccessResultItem,
): number => {
	if (success.totalCount > 0) return success.totalCount;
	const inconvertibleN =
		success.inconvertible > 0
			? success.inconvertible
			: (success.inconvertibleDetails?.length ?? 0);
	return success.convertible + inconvertibleN;
};

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
 * 기본 마감일 선택값: 오늘(로컬 자정 기준 Date)
 */
export const getDefaultDeadline = (): Date => {
	const d = new Date();
	return new Date(d.getFullYear(), d.getMonth(), d.getDate());
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

export type BuildRequestInput = {
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
	screening?: ScreeningDraft | null;
};

/** POST /v1/form-requests 요청 바디 조립 — 금액은 화면에서 계산한 총 결제액만 `dueCountPrice`·`totalCoin`에 동일 반영 */
export const buildCreateRequestBody = (
	input: BuildRequestInput,
): CreateRequestBody => {
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

	const body: CreateRequestBody = {
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
