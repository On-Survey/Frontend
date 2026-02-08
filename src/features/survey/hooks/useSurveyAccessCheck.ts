import {
	getAuthErrorFromException as getAuthErrorFromExceptionUtil,
	type SurveyAccessErrorDialog,
} from "@features/survey/lib/surveyErrorUtils";
import type { SurveyListItem } from "@shared/types/surveyList";
import { useCallback } from "react";

export type { SurveyAccessErrorDialog };

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
		async (err: unknown): Promise<SurveyAccessErrorDialog | null> =>
			getAuthErrorFromExceptionUtil(err, {
				surveyId,
				surveyFromState,
				source: locationState?.source,
				quiz_id: locationState?.quiz_id,
			}),
		[surveyId, surveyFromState, locationState?.source, locationState?.quiz_id],
	);

	return { getScreeningError, getAuthErrorFromException };
};
