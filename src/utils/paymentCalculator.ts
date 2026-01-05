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
 * 기본 가격 계산: 리워드(200원 × 인원수) + 서비스 이용료
 * 서비스 이용료: 50명=5,000원, 100명=10,000원, 150명=15,000원, 200명=20,000원
 */
const getBasePrice = (participants: string): number => {
	const count = parseParticipantsCount(participants);
	if (count === 0) return 0;

	// 리워드: 200원 × 인원수
	const reward = count * 200;

	// 서비스 이용료
	const serviceFee =
		count === 50
			? 5000
			: count === 100
				? 10000
				: count === 150
					? 15000
					: count === 200
						? 20000
						: 0;

	return reward + serviceFee;
};

/**
 * 연령대 타겟팅 추가금 계산
 * - 단일 연령대: +200원/건
 * - 복수 연령대: +100원/건
 * - 전체: 0원
 */
const getAgeSurcharge = (ages: AgeCode[], participants: string): number => {
	// "전체" 또는 빈 배열
	if (ages.length === 0 || (ages.length === 1 && ages[0] === "ALL")) {
		return 0;
	}

	const count = parseParticipantsCount(participants);
	if (count === 0) return 0;

	const filteredAges = ages.filter((age) => age !== "ALL");

	// 단일 연령대: +200원/건
	if (filteredAges.length === 1) {
		return count * 200;
	}

	// 복수 연령대: +100원/건
	if (filteredAges.length >= 2) {
		return count * 100;
	}

	return 0;
};

/**
 * 거주지 타겟팅 추가금 계산
 * - 쉬움 (서울/경기): +100원/건
 * - 보통 (광역시 단위): +200원/건
 * - 어려움 (도 단위): +300원/건
 * - 전체: 0원
 */
const getLocationSurcharge = (
	location: RegionCode,
	participants: string,
): number => {
	if (location === "ALL") {
		return 0;
	}

	const count = parseParticipantsCount(participants);
	if (count === 0) return 0;

	// 쉬움 (서울/경기): +100원/건
	if (REGIONS_5_PERCENT_SURCHARGE.some((region) => region.value === location)) {
		return count * 100;
	}
	// 보통 (광역시 단위): +200원/건
	if (
		REGIONS_10_PERCENT_SURCHARGE.some((region) => region.value === location)
	) {
		return count * 200;
	}
	// 어려움 (도 단위): +300원/건
	if (
		REGIONS_15_PERCENT_SURCHARGE.some((region) => region.value === location)
	) {
		return count * 300;
	}

	return 0;
};

/**
 * 성별 타겟팅 추가금 계산
 * - 단일 성별 (남/여): +100원/건
 * - 성별 무관: 0원
 */
const getGenderSurcharge = (
	gender: GenderCode,
	participants: string,
): number => {
	if (gender === "ALL") {
		return 0;
	}

	const count = parseParticipantsCount(participants);
	if (count === 0) return 0;
	return count * 100;
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
