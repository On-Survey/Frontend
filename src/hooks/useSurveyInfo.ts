import { useQuery } from "@tanstack/react-query";
import {
	getSurveyInfo,
	type SurveyBasicInfo,
} from "../service/surveyParticipation";

export const useSurveyInfo = (
	surveyId?: number,
	options?: {
		enabled?: boolean;
	},
) => {
	const { enabled = true } = options ?? {};

	return useQuery<SurveyBasicInfo>({
		queryKey: ["surveyInfo", surveyId],
		queryFn: () => {
			if (surveyId === undefined || surveyId === null) {
				throw new Error("surveyId가 필요합니다.");
			}
			return getSurveyInfo(surveyId);
		},
		enabled: Boolean(surveyId) && enabled,
	});
};
