import type { QuestionType } from "@shared/types/survey";

// 백엔드 questionType 매핑
export type BackendQuestionType =
	| "CHOICE"
	| "RATING"
	| "NPS"
	| "SHORT_ANSWER"
	| "LONG_ANSWER"
	| "DATE"
	| "NUMBER"
	| "IMAGE" // 이미지 전용 문항
	| "TITLE"; // 타이틀 전용 문항

// 백엔드 응답의 옵션 타입
export interface BackendOption {
	optionId: number;
	content: string;
	nextQuestionId: number;
	nextSection?: number; // 분기처리용 다음 섹션 번호 (0이면 설문 종료, 기본값은 현재 section + 1)
	imageUrl?: string; // 객관식 보기 내 이미지
}

// 백엔드 응답의 문항 타입 (기본)
export interface BaseSurveyParticipationQuestion {
	questionId: number;
	surveyId: number;
	questionType: BackendQuestionType;
	title: string;
	description: string;
	isRequired: boolean;
	questionOrder: number;
	section?: number; // 섹션 번호 (null이면 전체 조회)
	nextSection?: number; // 분기처리용 다음 섹션 번호 (문항 자체에 있는 경우, 0이면 설문 종료)
	isSectionDecidable?: boolean; // 섹션 분기처리 가능 여부
	imageUrl?: string; // 문항 내 이미지 또는 이미지 전용 문항
}

// 객관식 문항 (추가 필드 포함)
export interface ChoiceQuestion extends BaseSurveyParticipationQuestion {
	questionType: "CHOICE";
	maxChoice?: number;
	hasNoneOption?: boolean;
	hasCustomInput?: boolean;
	options?: BackendOption[];
}

// 날짜 문항
export interface DateQuestion extends BaseSurveyParticipationQuestion {
	questionType: "DATE";
	date?: string;
}

// 평가형 문항 (minValue/maxValue: 양끝 라벨, rate: 옵션 개수 1~rate)
export interface RatingQuestion extends BaseSurveyParticipationQuestion {
	questionType: "RATING";
	minValue?: string;
	maxValue?: string;
	rate?: number;
}

// 이미지 전용 문항 (타이틀·보조설명·이미지만)
export interface ImageQuestion extends BaseSurveyParticipationQuestion {
	questionType: "IMAGE";
	imageUrl: string; // 필수
}

// 기타 문항 타입
export type OtherQuestion = BaseSurveyParticipationQuestion & {
	questionType: "NPS" | "SHORT_ANSWER" | "LONG_ANSWER" | "NUMBER";
};

// 타이틀 전용 문항 (제목·설명만)
export type TitleQuestion = BaseSurveyParticipationQuestion & {
	questionType: "TITLE";
};

// 모든 문항 타입의 유니온
export type SurveyParticipationQuestion =
	| ChoiceQuestion
	| DateQuestion
	| RatingQuestion
	| ImageQuestion
	| OtherQuestion
	| TitleQuestion;

export const mapBackendQuestionType = (
	backendType: BackendQuestionType | string,
): QuestionType => {
	const mapping: Record<string, QuestionType> = {
		CHOICE: "multipleChoice",
		RATING: "rating",
		NPS: "nps",
		SHORT_ANSWER: "shortAnswer",
		SHORT: "shortAnswer",
		LONG_ANSWER: "longAnswer",
		LONG: "longAnswer",
		DATE: "date",
		NUMBER: "number",
		IMAGE: "image",
		TITLE: "title",
	};
	const key = String(backendType ?? "")
		.trim()
		.toUpperCase()
		.replace(/-/g, "_");
	return mapping[key] ?? "shortAnswer";
};

export interface SurveyParticipationInfo {
	surveyId: number;
	memberId: number;
	title: string;
	description: string;
	interests: string[];
	deadline: string;
	info: SurveyParticipationQuestion[];
	isFree?: boolean;
	responseCount?: number;
}

export interface SurveyInfo {
	surveyId: number;
	title: string;
	description: string;
	interests: string[];
	deadline: string;
	isFree?: boolean;
	responseCount: number;
}

export interface SurveyQuestionsInfo {
	info: SurveyParticipationQuestion[];
	sectionTitle?: string; // 섹션 제목
	sectionDescription?: string; // 섹션 설명
	currSection?: number; // 현재 섹션 번호
	nextSection?: number; // 다음 섹션 번호 (0이면 설문 종료)
}

// 섹션 타입
export interface SurveySection {
	sectionId: number;
	title: string;
	description: string;
	sectionOrder: number;
	questions: TransformedSurveyQuestion[];
}

export interface SurveySectionsInfo {
	sections: SurveySection[];
}

export interface SurveyBasicInfo {
	surveyId: number;
	title: string;
	description: string;
	deadline: string;
	interests: string[];
	responseCount: number;
	isScreenRequired: boolean;
	isScreened: boolean;
	isSurveyResponded: boolean;
	isFree: boolean;
	price?: number;
}

// 프론트엔드에서 사용하는 변환된 문항 타입
export interface TransformedSurveyQuestion {
	questionId: number;
	surveyId: number;
	type: QuestionType; // 변환된 타입
	title: string;
	description: string;
	isRequired: boolean;
	questionOrder: number;
	section?: number; // 섹션 번호
	imageUrl?: string; // 문항 내 이미지 또는 이미지 전용 문항
	// 타입별 추가 필드
	maxChoice?: number;
	hasNoneOption?: boolean;
	hasCustomInput?: boolean;
	isSectionDecidable?: boolean; // 섹션 분기처리 가능 여부
	nextSection?: number; // 분기처리용 다음 섹션 번호 (문항 자체에 있는 경우, 0이면 설문 종료)
	options?: Array<{
		optionId: number;
		content: string;
		nextQuestionId: number;
		order: number;
		nextSection?: number; // 분기처리용 다음 섹션 번호 (보기에 있는 경우, 0이면 설문 종료)
		imageUrl?: string; // 객관식 보기 내 이미지
	}>;
	date?: string;
	minValue?: string;
	maxValue?: string;
	rate?: number; // RATING: 옵션 개수 (1~rate)
}

export interface SubmitSurveyParticipationAnswer {
	questionId: number;
	content: string | null; // null: 객관식에서 해제, "" 또는 null: 텍스트 입력에서 지움
}

export interface SubmitSurveyParticipationPayload {
	infoList: SubmitSurveyParticipationAnswer[];
}

// 스크리닝 설문 관련 타입
export interface ScreeningQuestion {
	screeningId: number;
	surveyId: number;
	content: string;
	answer: boolean; // true: O, false: X
}

export interface ScreeningResponse {
	data: ScreeningQuestion[];
	hasNext: boolean;
}

export interface GetScreeningsParams {
	lastSurveyId?: number;
	size?: number;
}

export interface SubmitScreeningResponsePayload {
	content: string;
}
