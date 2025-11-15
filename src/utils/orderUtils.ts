import type { Survey } from "../service/order/types";
import type { Order } from "../types/order";

/**
 * 날짜 포맷 변환: "2025-11-15" -> "2025.11.15"
 */
export const formatDate = (dateString: string): string => {
	return dateString.replace(/-/g, ".");
};

/**
 * 코인 금액 포맷팅: 23400 -> "23,400원"
 */
export const formatPrice = (coin: number): string => {
	return `${coin.toLocaleString()}원`;
};

/**
 * API 응답을 Order 타입으로 변환
 */
export const mapSurveyToOrder = (
	survey: Pick<Survey, "surveyId" | "title" | "totalCoin" | "createdDate">,
	status: Order["status"],
): Order => {
	return {
		id: survey.surveyId,
		date: formatDate(survey.createdDate),
		title: survey.title,
		price: formatPrice(survey.totalCoin),
		status,
	};
};
