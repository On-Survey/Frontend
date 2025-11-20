import {
	type AgeCode,
	type GenderCode,
	REGIONS_5_PERCENT_SURCHARGE,
	REGIONS_10_PERCENT_SURCHARGE,
	REGIONS_15_PERCENT_SURCHARGE,
	type RegionCode,
} from "../constants/payment";
import type { Estimate } from "../contexts/PaymentContext";

const parseParticipantsCount = (participants: string): number => {
	const digitsOnly = participants.replace(/[^\d]/g, "");
	return digitsOnly ? parseInt(digitsOnly, 10) : 0;
};

/**
 * 희망 응답자 수에 따른 기본가 계산
 */
const getBasePrice = (participants: string): number => {
	const count = parseParticipantsCount(participants);
	return count * 550; // 건당 550원
};

/**
 * 연령대에 따른 추가금 계산
 * - 전체: 0원
 * - 단일 연령대: +15% (건당 105원)
 * - 복수 연령대: +20% (건당 140원)
 */
const getAgeSurcharge = (ages: AgeCode[], participants: string): number => {
	// "전체" 또는 빈 배열
	if (ages.length === 0 || (ages.length === 1 && ages[0] === "ALL")) {
		return 0;
	}

	const count = parseParticipantsCount(participants);
	const filteredAges = ages.filter((age) => age !== "ALL");

	// 단일 연령대: +15% (건당 105원)
	if (filteredAges.length === 1) {
		return count * 105;
	}

	// 복수 연령대: +20% (건당 140원)
	if (filteredAges.length >= 2) {
		return count * 140;
	}

	return 0;
};

/**
 * 거주지에 따른 추가금 계산
 */
const getLocationSurcharge = (
	location: RegionCode,
	participants: string,
): number => {
	if (location === "ALL") {
		return 0;
	}

	const count = parseParticipantsCount(participants);

	if (REGIONS_5_PERCENT_SURCHARGE.some((region) => region.value === location)) {
		// 쉬움 (서울/경기): +5% (건당 35원)
		return count * 35;
	} else if (
		REGIONS_10_PERCENT_SURCHARGE.some((region) => region.value === location)
	) {
		// 보통 (광역시): +10% (건당 70원)
		return count * 70;
	} else if (
		REGIONS_15_PERCENT_SURCHARGE.some((region) => region.value === location)
	) {
		// 어려움 (도 단위): +15% (건당 105원)
		return count * 105;
	}

	return 0;
};

/**
 * 성별에 따른 추가금 계산
 */
const getGenderSurcharge = (
	gender: GenderCode,
	participants: string,
): number => {
	if (gender === "ALL") {
		return 0;
	}

	const count = parseParticipantsCount(participants);
	// 단일 성별: +10% (건당 70원)
	return count * 70;
};

/**
 * 전체 금액 계산
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
	const dueCountPrice = getBasePrice(estimate.desiredParticipants);
	const agePrice = getAgeSurcharge(estimate.ages, estimate.desiredParticipants);
	const residencePrice = getLocationSurcharge(
		estimate.location,
		estimate.desiredParticipants,
	);
	const genderPrice = getGenderSurcharge(
		estimate.gender,
		estimate.desiredParticipants,
	);
	const totalPrice = dueCountPrice + agePrice + residencePrice + genderPrice;

	return {
		dueCount,
		dueCountPrice,
		agePrice,
		residencePrice,
		genderPrice,
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
	return `${price.toLocaleString("ko-KR")}코인`;
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
