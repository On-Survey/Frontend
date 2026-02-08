import { getRefreshToken } from "@shared/lib/tokenManager";
import type { ReturnTo } from "@shared/types/navigation";
import type { SurveyListItem } from "@shared/types/surveyList";
import { useCallback } from "react";

export interface SurveyAccessErrorDialog {
	open: boolean;
	title: string;
	description?: string;
	redirectTo?: string;
	returnTo?: ReturnTo;
}

interface UseSurveyAccessCheckParams {
	surveyBasicInfoData?: {
		isScreenRequired?: boolean;
		isScreened?: boolean;
	} | null;
	surveyId: string | null;
	surveyFromState?: SurveyListItem | null;
	locationState?: {
		source?: "main" | "quiz" | "after_complete";
		quiz_id?: number;
	} | null;
}

export const useSurveyAccessCheck = ({
	surveyBasicInfoData,
	surveyId,
	surveyFromState,
	locationState,
}: UseSurveyAccessCheckParams) => {
	const getScreeningError = useCallback((): SurveyAccessErrorDialog | null => {
		if (!surveyBasicInfoData) return null;

		if (surveyBasicInfoData.isScreenRequired) {
			return {
				open: true,
				title: "스크리닝이 필요합니다",
				description: "스크리닝을 완료한 후 참여할 수 있어요.",
				redirectTo: "/oxScreening",
			};
		}

		if (surveyBasicInfoData.isScreened) {
			return {
				open: true,
				title: "스크리닝 조건이 맞지 않습니다",
				description:
					"설정하신 스크리닝 조건에 맞지 않아 설문에 참여할 수 없어요.",
				redirectTo: "/home",
			};
		}

		return null;
	}, [surveyBasicInfoData]);

	const getAuthErrorFromException = useCallback(
		async (err: unknown): Promise<SurveyAccessErrorDialog | null> => {
			const error = err as {
				response?: { status: number };
				code?: string;
			};

			const isNetworkError = error.code === "ERR_NETWORK";
			const is401Error = error.response?.status === 401;

			if (is401Error || (isNetworkError && !(await getRefreshToken()))) {
				return {
					open: true,
					title: "로그인이 필요합니다",
					description: "로그인 후 이용해주세요",
					redirectTo: "/",
					returnTo: surveyId
						? {
								path: "/survey",
								state: {
									surveyId,
									survey: surveyFromState,
									source: locationState?.source ?? "main",
									quiz_id: locationState?.quiz_id,
								},
							}
						: undefined,
				};
			}

			if (error.response?.status === 403) {
				return {
					open: true,
					title: "권한이 없는 설문입니다",
					description: "해당 설문에 참여할 권한이 없습니다",
					redirectTo: "/survey/ineligible",
				};
			}

			return null;
		},
		[surveyId, surveyFromState, locationState?.source, locationState?.quiz_id],
	);

	return { getScreeningError, getAuthErrorFromException };
};
