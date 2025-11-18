import { getTossShareLink, share } from "@apps-in-toss/web-framework";

// 설문 참여 첫 페이지로 이동하는 토스 공유 링크를 생성 및 토스 공유 시트를 노출
export const shareSurveyById = async (surveyId: number) => {
	const shareSurveyId = surveyId > 0 ? surveyId : 1;
	const path = `/survey?surveyId=${shareSurveyId}`;
	const schemeUrl = `intoss://onsurvey?path=${encodeURIComponent(path)}`;

	if (import.meta.env.DEV) {
		alert(`로컬에서는 이 링크까지만 확인 가능:\n${schemeUrl}`);
		console.log("share schemeUrl:", schemeUrl);
		return;
	}

	try {
		const tossLink = await getTossShareLink(schemeUrl);
		await share({ message: tossLink });
	} catch (error) {
		console.error("설문 공유 링크 생성 실패:", error);
	}
};
