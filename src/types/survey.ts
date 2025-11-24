import type { Interest } from "../service/form";

export type QuestionType =
	| "multipleChoice" // 객관식
	| "rating" // 평가형 (양쪽 내용 + 원 10개)
	| "nps" // NPS (1~10)
	| "shortAnswer" // 단답형
	| "longAnswer" // 장문형
	| "date" // 날짜 (ex: 2025-10-26)
	| "number"; // 숫자형 (1~100)

export interface BaseQuestion {
	surveyId: number;
	questionId: number;
	type: QuestionType;
	title: string;
	description: string;
	isRequired: boolean;
	questionOrder: number;
}

// 객관식 문항 옵션
export interface MultipleChoiceOption {
	optionId: number | null;
	order: number;
	content: string;
	nextQuestionId: number | null;
}

// 객관식 문항
export interface MultipleChoiceQuestion extends BaseQuestion {
	type: "multipleChoice";
	maxChoice: number;
	hasCustomInput: boolean;
	hasOtherOption: boolean;
	option: MultipleChoiceOption[];
}

// 평가형 문항
export interface RatingQuestion extends BaseQuestion {
	type: "rating";
	minValue: string;
	maxValue: string;
	rate: number;
}

// NPS 문항
export interface NPSQuestion extends BaseQuestion {
	type: "nps";
}

// 단답형 문항
export interface ShortAnswerQuestion extends BaseQuestion {
	type: "shortAnswer";
}

// 장문형 문항
export interface LongAnswerQuestion extends BaseQuestion {
	type: "longAnswer";
}

// 날짜형 문항
export interface DateQuestion extends BaseQuestion {
	type: "date";
	date: Date;
}

// 숫자형 문항
export interface NumberQuestion extends BaseQuestion {
	type: "number";
}

// 모든 문항 타입의 유니온
export type Question =
	| MultipleChoiceQuestion
	| RatingQuestion
	| NPSQuestion
	| ShortAnswerQuestion
	| LongAnswerQuestion
	| DateQuestion
	| NumberQuestion;

// 문항 정보 구조
export interface QuestionInfo {
	surveyId: number;
	info: {
		multipleChoice: MultipleChoiceQuestion[];
		rating: RatingQuestion[];
		nps: NPSQuestion[];
		shortAnswer: ShortAnswerQuestion[];
		longAnswer: LongAnswerQuestion[];
		date: DateQuestion[];
		number: NumberQuestion[];
	};
}

// 설문 전체 인터페이스
export interface Survey {
	userId?: number;
	surveyId?: number;
	title: string;
	description: string;
	question: Question[];
}

// 스크리닝 타입
export type ScreeningAnswerType = "O" | "X";

// 스크리닝 정보 인터페이스
export interface ScreeningInfo {
	enabled: boolean; // 스크리닝 사용 여부
	question: string; // 스크리닝 질문
	answerType: ScreeningAnswerType | null; // 참여 가능한 답변 (O 또는 X)
}

// 관심사 정보 인터페이스
export interface TopicInfo {
	id: string;
	name: string;
	value: Interest;
}

// 설문 폼 상태 인터페이스
export interface SurveyFormState {
	surveyId: number | null;
	survey: Survey;
	isDirty: boolean; // 변경사항이 있는지 여부
	isSubmitting: boolean; // 제출 중인지 여부
	isLoading: boolean; // 로딩 중인지 여부
	error: string | null; // 에러 메시지
	titleStepCompleted: boolean; // 제목 단계 완료 여부
	screening: ScreeningInfo; // 스크리닝 정보
	topics: TopicInfo[]; // 관심사 정보
}

// 문항 업데이트를 위한 타입 (공통 필드만)
export type QuestionUpdateData = {
	questionId?: number;
	title?: string;
	description?: string;
	isRequired?: boolean;
	questionOrder?: number;
	maxChoice?: number;
	option?: MultipleChoiceOption[];
	minValue?: string;
	maxValue?: string;
	rate?: number;
	date?: Date;
	surveyId?: number;
	hasCustomInput?: boolean;
	hasOtherOption?: boolean;
};

// 설문 폼 액션 타입
export type SurveyFormAction =
	| { type: "SET_TITLE"; payload: string }
	| { type: "SET_DESCRIPTION"; payload: string }
	| { type: "ADD_QUESTION"; payload: Question }
	| {
			type: "UPDATE_QUESTION";
			payload: { id: string; question: QuestionUpdateData };
	  }
	| { type: "DELETE_QUESTION"; payload: string }
	| { type: "REORDER_QUESTIONS"; payload: Question[] }
	| { type: "SET_LOADING"; payload: boolean }
	| { type: "SET_SUBMITTING"; payload: boolean }
	| { type: "SET_ERROR"; payload: string | null }
	| { type: "SET_DIRTY"; payload: boolean }
	| { type: "SET_TITLE_STEP_COMPLETED"; payload: boolean }
	| { type: "SET_SCREENING_ENABLED"; payload: boolean }
	| { type: "SET_SCREENING_QUESTION"; payload: string }
	| { type: "SET_SCREENING_ANSWER_TYPE"; payload: ScreeningAnswerType | null }
	| { type: "SET_SCREENING"; payload: ScreeningInfo }
	| { type: "SET_TOPICS"; payload: TopicInfo[] }
	| { type: "ADD_TOPIC"; payload: TopicInfo }
	| { type: "REMOVE_TOPIC"; payload: string }
	| { type: "RESET_FORM" }
	| { type: "LOAD_SURVEY"; payload: Survey }
	| { type: "SET_SURVEY_ID"; payload: number };

// 설문 Context 타입
export interface SurveyContextType {
	state: SurveyFormState;
	dispatch: React.Dispatch<SurveyFormAction>;
	// 편의 함수들
	addQuestion: (question: Question) => void;
	updateQuestion: (id: string, question: QuestionUpdateData) => void;
	deleteQuestion: (id: string) => void;
	reorderQuestions: (questions: Question[]) => void;
	setTitle: (title: string) => void;
	setDescription: (description: string) => void;
	setTitleStepCompleted: (completed: boolean) => void;
	setScreeningEnabled: (enabled: boolean) => void;
	setScreeningQuestion: (question: string) => void;
	setScreeningAnswerType: (answerType: ScreeningAnswerType | null) => void;
	setScreening: (screening: ScreeningInfo) => void;
	setTopics: (topics: TopicInfo[]) => void;
	addTopic: (topic: TopicInfo) => void;
	removeTopic: (topicId: string) => void;
	resetForm: () => void;
	loadSurvey: (survey: Survey) => void;
	setSurveyId: (surveyId: number) => void;
}

// 타입 가드 함수들
export const isMultipleChoiceQuestion = (
	question: Question | undefined,
): question is MultipleChoiceQuestion => {
	return question?.type === "multipleChoice";
};

export const isRatingQuestion = (
	question: Question | undefined,
): question is RatingQuestion => {
	return question?.type === "rating";
};

export const isNPSQuestion = (
	question: Question | undefined,
): question is NPSQuestion => {
	return question?.type === "nps";
};

export const isShortAnswerQuestion = (
	question: Question | undefined,
): question is ShortAnswerQuestion => {
	return question?.type === "shortAnswer";
};

export const isLongAnswerQuestion = (
	question: Question | undefined,
): question is LongAnswerQuestion => {
	return question?.type === "longAnswer";
};

export const isDateQuestion = (
	question: Question | undefined,
): question is DateQuestion => {
	return question?.type === "date";
};

export const isNumberQuestion = (
	question: Question | undefined,
): question is NumberQuestion => {
	return question?.type === "number";
};
