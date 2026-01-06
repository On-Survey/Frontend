import { getTossShareLink, share } from "@apps-in-toss/web-framework";

export const shareSurveyById = async (
	surveyId: number,
	onShareSuccess?: () => void,
): Promise<void> => {
	const shareSurveyId = surveyId > 0 ? surveyId : 1;

	const path = `/survey?surveyId=${shareSurveyId}`;
	const schemeUrl = `intoss://onsurvey${path}`;

	const webBaseUrl =
		import.meta.env.DEV || import.meta.env.MODE === "development"
			? window.location.origin
			: "https://minion.toss.im/onsurvey";
	const shareUrl = `${webBaseUrl}${path}`;

	const OG_IMAGE_URL =
		"https://toss-storegroup.s3.us-east-1.amazonaws.com/image+(2).png";

	if (import.meta.env.DEV || import.meta.env.MODE === "development") {
		try {
			await navigator.clipboard.writeText(shareUrl);
			onShareSuccess?.();
		} catch (error) {
			console.error("링크 복사 실패:", error);
		}
		return;
	}

	try {
		const tossLink = await getTossShareLink(schemeUrl, OG_IMAGE_URL);

		onShareSuccess?.();
		await share({ message: tossLink });
	} catch (error) {
		console.error("설문 공유 링크 생성 실패:", error);

		try {
			await navigator.clipboard.writeText(shareUrl);
			onShareSuccess?.();
		} catch (clipboardError) {
			console.error("링크 복사 실패:", clipboardError);
		}
	}
};
