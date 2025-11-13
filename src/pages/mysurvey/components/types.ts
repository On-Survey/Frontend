interface BaseSurvey {
	id: number;
	title: string;
	description?: string;
	memberId?: number;
}

export interface DraftSurvey extends BaseSurvey {}

export interface ActiveSurvey extends BaseSurvey {
	progress?: number;
	total?: number;
	deadline?: string;
}

export interface ClosedSurvey extends BaseSurvey {
	closedAt?: string;
}

export type SurveyCardType = "draft" | "active" | "closed";
