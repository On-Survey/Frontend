import { useQuery } from "@tanstack/react-query";
import { getAllOngoingSurveys } from "../service/surveyList";

export const useAllOngoingSurveys = (options?: { enabled?: boolean }) => {
	return useQuery({
		queryKey: ["allOngoingSurveys"],
		queryFn: () => getAllOngoingSurveys({ lastSurveyId: 0, size: 100 }), // 충분히 큰 size로 모든 설문 가져오기
		enabled: options?.enabled ?? true,
	});
};
