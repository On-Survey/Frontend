import {
	postSurveyHelpRequest,
	type SurveyHelpRequestBody,
} from "@features/survey/service/helpRequests";
import { useMutation } from "@tanstack/react-query";

export const useSurveyHelpRequestMutation = () => {
	return useMutation({
		mutationFn: (body: SurveyHelpRequestBody) => postSurveyHelpRequest(body),
		retry: 0,
	});
};
