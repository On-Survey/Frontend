export interface DraftSurvey {
	id: number;
	title: string;
}

export interface ActiveSurvey {
	id: number;
	title: string;
	description?: string;
	memberId?: number;
	progress?: number;
	total?: number;
	deadline?: string;
}

export interface ClosedSurvey {
	id: number;
	title: string;
}

export type SurveyCardType = "draft" | "active" | "closed";
