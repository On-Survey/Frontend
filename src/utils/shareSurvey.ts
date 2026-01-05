// 설문 참여 첫 페이지로 이동하는 토스 공유 링크를 생성 및 OS별 공유 시트 노출
import { getTossShareLink, share } from "@apps-in-toss/web-framework";

export const shareSurveyById = async (
	surveyId: number,
	onShareSuccess?: () => void,
): Promise<void> => {
	const shareSurveyId = surveyId > 0 ? surveyId : 1;
	const path = `/survey?surveyId=${shareSurveyId}`;
	const baseUrl =
		import.meta.env.DEV || import.meta.env.MODE === "development"
			? window.location.origin
			: "https://minion.toss.im/onsurvey";
	const shareUrl = `${baseUrl}${path}`;
	const schemeUrl = `intoss://onsurvey?path=${encodeURIComponent(path)}`;

	// 앱 출시 전에는 클립보드 복사
	if (import.meta.env.DEV || import.meta.env.MODE === "development") {
		try {
			await navigator.clipboard.writeText(shareUrl);
			if (onShareSuccess) {
				onShareSuccess();
			}
		} catch (error) {
			console.error("링크 복사 실패:", error);
			const textArea = document.createElement("textarea");
			textArea.value = shareUrl;
			textArea.style.position = "fixed";
			textArea.style.opacity = "0";
			document.body.appendChild(textArea);
			textArea.select();
			try {
				document.execCommand("copy");
				if (onShareSuccess) {
					onShareSuccess();
				}
			} catch (err) {
				console.error("링크 복사 실패 (fallback):", err);
			} finally {
				document.body.removeChild(textArea);
			}
		}
		return;
	}

	// 프로덕션 환경에서는 토스 공유 링크 사용
	try {
		const tossLink = await getTossShareLink(schemeUrl);
		if (onShareSuccess) {
			onShareSuccess();
		}
		await share({ message: tossLink });
	} catch (error) {
		console.error("설문 공유 링크 생성 실패:", error);
		try {
			await navigator.clipboard.writeText(shareUrl);
			if (onShareSuccess) {
				onShareSuccess();
			}
		} catch (clipboardError) {
			console.error("링크 복사 실패:", clipboardError);
		}
	}
};
