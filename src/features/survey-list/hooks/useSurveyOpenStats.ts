import { useQuery } from "@tanstack/react-query";
import { getSurveyOpenStats } from "../service/surveyList";

export const useSurveyOpenStats = () => {
	return useQuery({
		queryKey: ["surveyOpenStats"],
		queryFn: getSurveyOpenStats,
	});
};
