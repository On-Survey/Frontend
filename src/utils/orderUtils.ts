import {
	AGE,
	type AgeCode,
	type GenderCode,
	getGenderLabel,
	getRegionLabel,
	type RegionCode,
} from "../constants/payment";
import type {
	Survey,
	SurveyDetailResult,
	SurveyInfo,
} from "../service/order/types";
import type { Order, OrderDetail } from "../types/order";
import { formatAgeLabel, formatPrice } from "./estimatePrice";

export const formatDate = (dateString: string): string => {
	return dateString.replace(/-/g, ".");
};

const formatGender = (gender: SurveyInfo["gender"]): string => {
	return getGenderLabel(gender as GenderCode) || "전체";
};

const formatResidence = (residence: string): string => {
	if (residence === "ALL") {
		return "전체";
	}
	return getRegionLabel(residence as RegionCode) || residence;
};

/**
 * API 응답을 Order 타입으로 변환
 */
export const mapSurveyToOrder = (
	survey: Pick<
		Survey,
		"surveyId" | "title" | "totalCoin" | "createdDate" | "deadline"
	>,
	status: Order["status"],
): Order => {
	const now = new Date();
	const deadline = new Date(survey.deadline);
	const isDeadlinePassed = !Number.isNaN(deadline.getTime()) && deadline < now;
	const computedStatus: Order["status"] =
		status === "active" && isDeadlinePassed ? "closed" : status;

	return {
		id: survey.surveyId,
		date: formatDate(survey.createdDate),
		title: survey.title,
		price: formatPrice(survey.totalCoin),
		status: computedStatus,
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

export const mapSurveyDetailToOrderDetail = (
	surveyDetail: SurveyDetailResult,
): OrderDetail => {
	return {
		id: surveyDetail.surveyId,
		title: surveyDetail.title,
		status: mapSurveyStatusToOrderStatus(surveyDetail.status),
		orderDate: surveyDetail.createdAt,
		paymentInfo: {
			responseCount: surveyDetail.surveyInfo.dueCount,
			responseCountPrice: surveyDetail.surveyInfo.dueCountPrice,
			gender: formatGender(surveyDetail.surveyInfo.gender),
			genderPrice: surveyDetail.surveyInfo.genderPrice,
			ageRange: formatAgeLabel(
				surveyDetail.surveyInfo.ages.filter((age): age is AgeCode =>
					AGE.map((option) => option.value).includes(age as AgeCode),
				) as AgeCode[],
			),
			ageRangePrice: surveyDetail.surveyInfo.agePrice,
			location: formatResidence(surveyDetail.surveyInfo.residence),
			locationPrice: surveyDetail.surveyInfo.residencePrice,
		},
		totalPrice: formatPrice(surveyDetail.totalCoin),
	};
};
