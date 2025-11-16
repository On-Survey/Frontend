interface BaseResponse {
	code: number | string;
	message: string;
	success: boolean;
}

export interface OngoingSurveySummary {
	surveyId: number;
	memberId: number;
	title: string;
	description: string;
}

export interface OngoingSurveyResult {
	recommended: OngoingSurveySummary[];
	impending: OngoingSurveySummary[];
	hasNext: boolean;
}

export interface OngoingSurveyResponse extends BaseResponse {
	result: OngoingSurveyResult;
}

export interface SurveyQuestionInfo {
	questionId: number;
	surveyId: number;
	type: string;
	title: string;
	description: string;
	isRequired: boolean;
	questionOrder: number;
}

export interface SurveyDetailResult {
	info: SurveyQuestionInfo[];
}

export interface SurveyDetailResponse extends BaseResponse {
	result: SurveyDetailResult;
}

export interface ScreeningQuestionSummary {
	screeningId: number;
	surveyId: number;
	content: string;
	answer: boolean;
}

export interface ScreeningQuestionResult {
	data: ScreeningQuestionSummary[];
	hasNext: boolean;
}

export interface ScreeningQuestionResponse extends BaseResponse {
	result: ScreeningQuestionResult;
}

export interface SurveyResponseInfo {
	questionId: number;
	content: string;
}

export interface SubmitSurveyResponsePayload {
	infoList: SurveyResponseInfo[];
}

export interface SubmitSurveyResponse extends BaseResponse {
	result: boolean;
}

// 사용자가 관리할 설문 상세 조회
export interface SurveyAnswerDetailInfo {
	questionId: number;
	order: number;
	type: string;
	title: string;
	description: string;
	isRequired: boolean;
	answerMap: Record<string, number>;
	answerList: string[];
}

export interface SurveyAnswerDetailResult {
	surveyId: number;
	memberId: number;
	status: string;
	currentCount: number;
	detailInfoList: SurveyAnswerDetailInfo[];
}

export interface SurveyAnswerDetailResponse extends BaseResponse {
	result: SurveyAnswerDetailResult;
}

// 작성 중인 설문 조회
export type WritingQuestionType =
	| "CHOICE"
	| "DATE"
	| "NUMBER"
	| "TEXT"
	| string;

export interface WritingQuestionOption {
	optionId: number;
	content: string;
	nextQuestionId?: number;
}

export interface WritingQuestion {
	questionId: number;
	surveyId: number;
	questionType: WritingQuestionType;
	title: string;
	description: string;
	isRequired: boolean;
	questionOrder: number;
	// 선택형 확장 필드
	choice?: boolean;
	maxChoice?: number;
	hasNoneOption?: boolean;
	hasCustomInput?: boolean;
	options?: WritingQuestionOption[];
	// 날짜형 확장 필드
	date?: string;
	// 숫자형 확장 필드
	minValue?: string | number;
	maxValue?: string | number;
}

export interface WritingSurveyResult {
	surveyId: number;
	questions: WritingQuestion[];
}

export interface WritingSurveyResponse extends BaseResponse {
	result: WritingSurveyResult;
}
