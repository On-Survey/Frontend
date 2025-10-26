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
