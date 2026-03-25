import type { Estimate } from "../contexts/PaymentContext";
import { lookupEstimateTablePrice } from "./estimatePricingTable";

const parseParticipantsCount = (participants: string): number => {
	const digitsOnly = participants.replace(/[^\d]/g, "");
	return digitsOnly ? parseInt(digitsOnly, 10) : 0;
};

/**
 * 결제·폼 생성용 금액 분해 (견적서 표 기준 총액은 `dueCountPrice`에 일괄 반영)
 */
export interface PriceBreakdown {
	dueCount: number;
	dueCountPrice: number;
	agePrice: number;
	residencePrice: number;
	genderPrice: number;
	totalPrice: number;
}

export const calculatePriceBreakdown = (estimate: Estimate): PriceBreakdown => {
	const dueCount = parseParticipantsCount(estimate.desiredParticipants);
	const totalPrice = lookupEstimateTablePrice(estimate);

	return {
		dueCount,
		dueCountPrice: totalPrice,
		agePrice: 0,
		residencePrice: 0,
		genderPrice: 0,
		totalPrice,
	};
};

export const calculateTotalPrice = (estimate: Estimate): number => {
	return calculatePriceBreakdown(estimate).totalPrice;
};

/**
 * 금액을 포맷팅하여 반환 (예: 56500 -> "56,500원")
 */
export const formatPrice = (price: number): string => {
	return `${price.toLocaleString("ko-KR")}원`;
};

/**
 * 금액을 코인 형식으로 포맷팅하여 반환 (예: 56500 -> "56,500코인")
 */
export const formatPriceAsCoin = (price: number): string => {
	return `${price.toLocaleString("ko-KR")} 코인`;
};

/**
 * 충전이 필요한 금액을 계산
 * @param currentCoin 현재 보유 코인
 * @param requiredPrice 결제에 필요한 금액 (코인)
 * @returns 충전이 필요한 금액. 보유 코인이 충분하면 0을 반환
 */
export const calculateRequiredCoinAmount = (
	currentCoin: number,
	requiredPrice: number,
): number => {
	const shortage = requiredPrice - currentCoin;
	return shortage > 0 ? shortage : 0;
};
