import type {
	Survey,
	SurveyDetailResult,
	SurveyInfo,
} from "../service/order/types";
import type { Order, OrderDetail } from "../types/order";

/**
 * 날짜 포맷 변환: "2025-11-15" -> "2025.11.15"
 */
export const formatDate = (dateString: string): string => {
	return dateString.replace(/-/g, ".");
};

/**
 * ISO 날짜를 주문 일자 형식으로 변환: "2025-11-15T18:59:15.058Z" -> "2025.11.15"
 */
export const formatOrderDate = (dateString: string): string => {
	const date = new Date(dateString);
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");
	return `${year}.${month}.${day}`;
};

/**
 * 코인 금액 포맷팅: 23400 -> "23,400원"
 */
export const formatPrice = (coin: number): string => {
	return `${coin.toLocaleString()}원`;
};

/**
 * 성별 값 변환: API -> UI
 */
const formatGender = (gender: SurveyInfo["gender"]): string => {
	switch (gender) {
		case "ALL":
			return "전체";
		case "MALE":
			return "남성";
		case "FEMALE":
			return "여성";
		default:
			return "단일";
	}
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

/**
 * 설문 상태를 OrderDetail 상태로 변환
 */
const mapSurveyStatusToOrderStatus = (
	status: Survey["status"],
): OrderDetail["status"] => {
	switch (status) {
		case "ONGOING":
			return "active";
		case "CLOSED":
			return "closed";
		case "REFUNDED":
			return "refund_completed";
		default:
			return "active";
	}
};

/**
 * API 응답을 OrderDetail 타입으로 변환
 */
export const mapSurveyDetailToOrderDetail = (
	surveyDetail: SurveyDetailResult,
): OrderDetail => {
	return {
		id: surveyDetail.surveyId,
		title: surveyDetail.title,
		status: mapSurveyStatusToOrderStatus(surveyDetail.status),
		orderDate: formatOrderDate(surveyDetail.createdAt),
		paymentInfo: {
			responseCount: surveyDetail.surveyInfo.dueCount,
			responseCountPrice: surveyDetail.surveyInfo.dueCountPrice,
			gender: formatGender(surveyDetail.surveyInfo.gender),
			genderPrice: surveyDetail.surveyInfo.genderPrice,
			ageRange:
				surveyDetail.surveyInfo.age === "ALL"
					? "전체"
					: surveyDetail.surveyInfo.age,
			ageRangePrice: surveyDetail.surveyInfo.agePrice,
			location:
				surveyDetail.surveyInfo.residence === "ALL"
					? "전체"
					: surveyDetail.surveyInfo.residence,
			locationPrice: surveyDetail.surveyInfo.residencePrice,
		},
		totalPrice: formatPrice(surveyDetail.totalCoin),
	};
};
