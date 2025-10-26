// 설문 문항 타입 정의
export type QuestionType =
	| "multiple_choice" // 객관식
	| "rating" // 평가형 (양쪽 내용 + 원 10개)
	| "nps" // NPS (1~10)
	| "short_answer" // 단답형
	| "essay" // 장문형
	| "date" // 날짜 (ex: 2025-10-26)
	| "number"; // 숫자형 (1~100)

// 객관식 문항 옵션
export interface MultipleChoiceOption {
	id: string;
	text: string;
}

// 평가형 문항 설정
export interface RatingQuestionConfig {
	leftLabel: string; // 왼쪽 라벨
	rightLabel: string; // 오른쪽 라벨
	scale: number; // 스케일 (기본 10)
}

// 기본 문항 인터페이스
export interface BaseQuestion {
	id: string;
	type: QuestionType;
	title: string;
	description?: string;
	required: boolean;
	order: number;
}

// 객관식 문항
export interface MultipleChoiceQuestion extends BaseQuestion {
	type: "multiple_choice";
	options: MultipleChoiceOption[];
	allowSelection: number; // 선택 가능한 최대 개수
}

// 평가형 문항
export interface RatingQuestion extends BaseQuestion {
	type: "rating";
	config: RatingQuestionConfig;
}

// NPS 문항
export interface NPSQuestion extends BaseQuestion {
	type: "nps";
	scale: number; // 스케일
}

// 서술형 문항
export interface EssayQuestion extends BaseQuestion {
	type: "essay";
}

// 날짜 문항
export interface DateQuestion extends BaseQuestion {
	type: "date";
	choiceDate: string;
}

// 단답형 문항
export interface ShortAnswerQuestion extends BaseQuestion {
	type: "short_answer";
}

// 숫자형 문항
export interface NumberQuestion extends BaseQuestion {
	type: "number";
	value: number;
}

// 모든 문항 타입의 유니온
export type Question =
	| MultipleChoiceQuestion
	| RatingQuestion
	| NPSQuestion
	| EssayQuestion
	| DateQuestion
	| ShortAnswerQuestion
	| NumberQuestion;

// 설문 전체 인터페이스
export interface Survey {
	id: string;
	title: string;
	description?: string;
	questions: Question[];
	createdAt: string;
	updatedAt: string;
	status: "draft" | "published" | "closed";
	authorId: string;
}

// 설문 생성/편집을 위한 폼 데이터 인터페이스
export interface SurveyFormData {
	title: string;
	description: string;
	questions: Question[];
}

// 설문 폼 상태 인터페이스
export interface SurveyFormState {
	formData: SurveyFormData;
	isDirty: boolean; // 변경사항이 있는지 여부
	isSubmitting: boolean; // 제출 중인지 여부
	isLoading: boolean; // 로딩 중인지 여부
	error: string | null; // 에러 메시지
}

// 문항 업데이트를 위한 타입 (공통 필드만)
export type QuestionUpdateData = {
	id?: string;
	title?: string;
	description?: string;
	required?: boolean;
	order?: number;
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
	| { type: "RESET_FORM" }
	| { type: "LOAD_SURVEY"; payload: Survey };

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
	resetForm: () => void;
	loadSurvey: (survey: Survey) => void;
}
