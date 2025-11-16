import { getTossShareLink, share } from "@apps-in-toss/web-framework";

/**
 * 설문 참여 첫 페이지로 이동하는 토스 공유 링크를 생성하고,
 * 토스 공유 시트를 노출하는 유틸리티.
 *
 * 개발 환경(import.meta.env.DEV)에서는 실제 공유 대신
 * 링크만 alert/console로 확인합니다.
 */
export const shareSurveyById = async (surveyId: number) => {
	const shareSurveyId = surveyId > 0 ? surveyId : 1;
	const path = `/survey?surveyId=${shareSurveyId}`;
	const schemeUrl = `intoss://onsurvey?path=${encodeURIComponent(path)}`;

	// 로컬/Granite dev에서는 링크만 확인
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
