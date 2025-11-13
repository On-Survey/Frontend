import type { QuestionType } from "../../types/survey";

export interface SurveyParticipationQuestion {
	questionId: number;
	surveyId: number;
	type: QuestionType;
	title: string;
	description: string;
	isRequired: boolean;
	questionOrder: number;
}

export interface SurveyParticipationInfo {
	info: SurveyParticipationQuestion[];
}

export interface SubmitSurveyParticipationAnswer {
	questionId: number;
	content: string;
}

export interface SubmitSurveyParticipationPayload {
	infoList: SubmitSurveyParticipationAnswer[];
}
