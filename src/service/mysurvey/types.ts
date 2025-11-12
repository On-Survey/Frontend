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

export interface OngoingSurveyResponse {
	code: number;
	message: string;
	result: OngoingSurveyResult;
	success: boolean;
}
