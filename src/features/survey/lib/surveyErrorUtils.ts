import * as Sentry from "@sentry/react";
import { getRefreshToken } from "@shared/lib/tokenManager";
import type { ReturnTo } from "@shared/types/navigation";
import type { SurveyListItem } from "@shared/types/surveyList";

export interface SurveyAccessErrorDialog {
	open: boolean;
	title: string;
	description?: string;
	redirectTo?: string;
	returnTo?: ReturnTo;
}

export interface SurveyErrorContext {
	surveyId: string | null;
	surveyFromState?: SurveyListItem | null;
	source?: "main" | "quiz" | "after_complete";
	quiz_id?: number;
}

export const getAuthErrorFromException = async (
	err: unknown,
	context: SurveyErrorContext,
): Promise<SurveyAccessErrorDialog | null> => {
	const error = err as {
		response?: { status: number };
		code?: string;
	};

	const isNetworkError = error.code === "ERR_NETWORK";
	const is401Error = error.response?.status === 401;

	if (is401Error || (isNetworkError && !(await getRefreshToken()))) {
		Sentry.captureException(err);
		return {
			open: true,
			title: "로그인이 필요합니다",
			description: "로그인 후 이용해주세요",
			redirectTo: "/",
			returnTo: context.surveyId
				? {
						path: "/survey",
						state: {
							surveyId: context.surveyId,
							survey: context.surveyFromState,
							source: context.source ?? "main",
							quiz_id: context.quiz_id,
						},
					}
				: undefined,
		};
	}

	if (error.response?.status === 403) {
		Sentry.captureException(err);
		return {
			open: true,
			title: "권한이 없는 설문입니다",
			description: "해당 설문에 참여할 권한이 없습니다",
			redirectTo: "/survey/ineligible",
		};
	}

	return null;
};
