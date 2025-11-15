import {
	REGIONS_5_PERCENT_SURCHARGE,
	REGIONS_10_PERCENT_SURCHARGE,
	REGIONS_15_PERCENT_SURCHARGE,
	REGIONS_NO_SURCHARGE,
} from "../constants/payment";
import type { Estimate } from "../contexts/PaymentContext";

export interface PriceBreakdown {
	questionCount: { label: string; price: number };
	desiredParticipants: { label: string; price: number };
	gender: { label: string; price: number };
	age: { label: string; price: number };
	location: { label: string; price: number };
	total: number;
}

// 문항 수 가격 계산
const getQuestionCountPrice = (questionCount: string): number => {
	switch (questionCount) {
		case "1~10":
			return 500;
		case "11~20":
			return 700;
		case "21~30":
			return 1000;
		case "31~50":
			return 1500;
		case "51~70":
			return 2000;
		default:
			return 0;
	}
};

/**
 * 희망 응답자 수에 따른 기본가 계산
 */
const getBasePrice = (participants: string): number => {
	const count = parseInt(participants.replace("명", ""), 10);
	if (Number.isNaN(count)) return 0;
	return count * 550; // 건당 550원
};

/**
 * 연령대에 따른 추가금 계산
 */
const getAgeSurcharge = (age: string, participants: string): number => {
	if (age === "전체") {
		return 0;
	}

	const count = parseInt(participants.replace("명", ""), 10);
	if (Number.isNaN(count)) return 0;

	// 연령대가 하나인지 여러 개인지 확인
	// "20대", "30대" 등 단일 연령대는 숫자+대 패턴이 하나만 있음
	// "20, 30대" 등 복수 연령대는 쉼표가 있거나 여러 개가 있음
	const ageMatches = age.match(/\d+대/g);
	const isMultipleAges = ageMatches ? ageMatches.length > 1 : false;

	if (isMultipleAges) {
		// 복수 연령대: +20% (건당 140원)
		return count * 140;
	} else {
		// 단일 연령대: +15% (건당 105원)
		return count * 105;
	}
};

/**
 * 거주지에 따른 추가금 계산
 */
const getLocationSurcharge = (
	location: string,
	participants: string,
): number => {
	if (location === "전체") {
		return 0;
	}

	const count = parseInt(participants.replace("명", ""), 10);
	if (Number.isNaN(count)) return 0;

	if (REGIONS_5_PERCENT_SURCHARGE.some((region) => location.includes(region))) {
		// 쉬움 (서울/경기): +5% (건당 35원)
		return count * 35;
	} else if (
		REGIONS_10_PERCENT_SURCHARGE.some((region) => location.includes(region))
	) {
		// 보통 (광역시): +10% (건당 70원)
		return count * 70;
	} else if (
		REGIONS_15_PERCENT_SURCHARGE.some((region) => location.includes(region))
	) {
		// 어려움 (도 단위): +15% (건당 105원)
		return count * 105;
	}

	return 0;
};

/**
 * 성별에 따른 추가금 계산
 */
const getGenderSurcharge = (gender: string, participants: string): number => {
	if (gender === "전체") {
		return 0;
	}

	const count = parseInt(participants.replace("명", ""), 10);
	if (Number.isNaN(count)) return 0;
	// 단일 성별: +10% (건당 70원)
	return count * 70;
};

// 거주지 난이도 표시
const getLocationDifficulty = (location: string): string => {
	if (location === "전체") {
		return "";
	}
	if (REGIONS_NO_SURCHARGE.includes(location)) {
		return "(쉬움)";
	}
	if (REGIONS_5_PERCENT_SURCHARGE.includes(location)) {
		return "(쉬움)";
	}
	if (REGIONS_10_PERCENT_SURCHARGE.includes(location)) {
		return "(보통)";
	}
	if (REGIONS_15_PERCENT_SURCHARGE.includes(location)) {
		return "(어려움)";
	}
	return "";
};

export const calculateEstimatePrice = (estimate: Estimate): PriceBreakdown => {
	const questionCountPrice = getQuestionCountPrice(estimate.questionCount);
	const basePrice = getBasePrice(estimate.desiredParticipants);
	const ageSurcharge = getAgeSurcharge(
		estimate.age,
		estimate.desiredParticipants,
	);
	const locationSurcharge = getLocationSurcharge(
		estimate.location,
		estimate.desiredParticipants,
	);
	const genderSurcharge = getGenderSurcharge(
		estimate.gender,
		estimate.desiredParticipants,
	);

	const total =
		questionCountPrice +
		basePrice +
		ageSurcharge +
		locationSurcharge +
		genderSurcharge;

	return {
		questionCount: {
			label: estimate.questionCount
				? `${estimate.questionCount}개`
				: "선택 안함",
			price: questionCountPrice,
		},
		desiredParticipants: {
			label: estimate.desiredParticipants
				? `${estimate.desiredParticipants}명`
				: "선택 안함",
			price: basePrice,
		},
		gender: {
			label: estimate.gender || "선택 안함",
			price: genderSurcharge,
		},
		age: {
			label: estimate.age || "선택 안함",
			price: ageSurcharge,
		},
		location: {
			label: estimate.location
				? `${estimate.location} ${getLocationDifficulty(estimate.location)}`
				: "선택 안함",
			price: locationSurcharge,
		},
		total,
	};
};

/**
 * 전체 금액 계산
 */
export const calculateTotalPrice = (estimate: Estimate): number => {
	const breakdown = calculateEstimatePrice(estimate);
	return breakdown.total;
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
