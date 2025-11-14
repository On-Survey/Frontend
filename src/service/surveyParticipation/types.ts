import type { QuestionType } from "../../types/survey";

// 백엔드 questionType 매핑
export type BackendQuestionType =
	| "CHOICE"
	| "RATING"
	| "NPS"
	| "SHORT_ANSWER"
	| "LONG_ANSWER"
	| "DATE"
	| "NUMBER";

// 백엔드 응답의 옵션 타입
export interface BackendOption {
	optionId: number;
	content: string;
	nextQuestionId: number;
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

// 평가형 문항
export interface RatingQuestion extends BaseSurveyParticipationQuestion {
	questionType: "RATING";
	minValue?: string;
	maxValue?: string;
}

// 기타 문항 타입
export type OtherQuestion = BaseSurveyParticipationQuestion & {
	questionType: "NPS" | "SHORT_ANSWER" | "LONG_ANSWER" | "NUMBER";
};

// 모든 문항 타입의 유니온
export type SurveyParticipationQuestion =
	| ChoiceQuestion
	| DateQuestion
	| RatingQuestion
	| OtherQuestion;

// 백엔드 questionType을 프론트엔드 QuestionType으로 변환
export const mapBackendQuestionType = (
	backendType: BackendQuestionType,
): QuestionType => {
	const mapping: Record<BackendQuestionType, QuestionType> = {
		CHOICE: "multipleChoice",
		RATING: "rating",
		NPS: "nps",
		SHORT_ANSWER: "shortAnswer",
		LONG_ANSWER: "longAnswer",
		DATE: "date",
		NUMBER: "number",
	};
	return mapping[backendType] || "shortAnswer";
};

export interface SurveyParticipationInfo {
	info: SurveyParticipationQuestion[];
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
	// 타입별 추가 필드
	maxChoice?: number;
	hasNoneOption?: boolean;
	hasCustomInput?: boolean;
	options?: Array<{
		optionId: number;
		content: string;
		nextQuestionId: number;
		order: number;
	}>;
	date?: string;
	minValue?: string;
	maxValue?: string;
}

export interface SubmitSurveyParticipationAnswer {
	questionId: number;
	content: string;
}

export interface SubmitSurveyParticipationPayload {
	infoList: SubmitSurveyParticipationAnswer[];
}
