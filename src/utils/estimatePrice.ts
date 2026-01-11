import {
	AGE_LABEL_MAP,
	type AgeCode,
	type GenderCode,
	getGenderLabel,
	getRegionLabel,
	REGIONS_5_PERCENT_SURCHARGE,
	REGIONS_10_PERCENT_SURCHARGE,
	REGIONS_15_PERCENT_SURCHARGE,
	REGIONS_NO_SURCHARGE,
	type RegionCode,
} from "../constants/payment";
import type { Estimate } from "../contexts/PaymentContext";

export interface PriceBreakdown {
	desiredParticipants: { label: string; price: number };
	gender: { label: string; price: number };
	age: { label: string; price: number };
	location: { label: string; price: number };
	total: number;
}

/**
 * 기본 가격 계산: 리워드(200원 × 인원수) + 서비스 이용료
 * 서비스 이용료: 50명=5,000원, 100명=10,000원, 150명=15,000원, 200명=20,000원
 */
const getBasePrice = (participants: string): number => {
	const count = parseInt(participants.replace("명", ""), 10);
	if (Number.isNaN(count)) return 0;

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

	const count = parseInt(participants.replace("명", ""), 10);
	if (Number.isNaN(count)) return 0;

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
	location: string,
	participants: string,
): number => {
	if (location === "ALL") {
		return 0;
	}

	const count = parseInt(participants.replace("명", ""), 10);
	if (Number.isNaN(count)) return 0;

	// 쉬움 (서울/경기): +100원/건
	if (
		REGIONS_5_PERCENT_SURCHARGE.some((region) =>
			location.includes(region.value),
		)
	) {
		return count * 100;
	}
	// 보통 (광역시 단위): +200원/건
	if (
		REGIONS_10_PERCENT_SURCHARGE.some((region) =>
			location.includes(region.value),
		)
	) {
		return count * 200;
	}
	// 어려움 (도 단위): +300원/건
	if (
		REGIONS_15_PERCENT_SURCHARGE.some((region) =>
			location.includes(region.value),
		)
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
const getGenderSurcharge = (gender: string, participants: string): number => {
	if (gender === "ALL") {
		return 0;
	}

	const count = parseInt(participants.replace("명", ""), 10);
	if (Number.isNaN(count)) return 0;
	return count * 100;
};

const getLocationDifficulty = (location: string): string => {
	if (location === "ALL") {
		return "";
	}
	if (REGIONS_NO_SURCHARGE.some((region) => region.value === location)) {
		return "(쉬움)";
	}
	if (REGIONS_5_PERCENT_SURCHARGE.some((region) => region.value === location)) {
		return "(쉬움)";
	}
	if (
		REGIONS_10_PERCENT_SURCHARGE.some((region) => region.value === location)
	) {
		return "(보통)";
	}
	if (
		REGIONS_15_PERCENT_SURCHARGE.some((region) => region.value === location)
	) {
		return "(어려움)";
	}
	return "";
};

export const formatAgeLabel = (ages: AgeCode[]): string => {
	if (ages.length === 0 || (ages.length === 1 && ages[0] === "ALL")) {
		return "전체";
	}

	const filteredAges = ages.filter((age) => age !== "ALL");

	if (filteredAges.length === 0) {
		return "전체";
	}

	return filteredAges
		.map((code) => {
			const fullLabel = AGE_LABEL_MAP[code] ?? "";
			// "10대(10세~19세)" -> "10대" 추출
			const match = fullLabel.match(/^([^(]+)/);
			return match ? match[1] : fullLabel;
		})
		.filter(Boolean)
		.join(", ");
};

const formatLocationLabel = (location: string): string => {
	if (!location) {
		return "선택 안함";
	}
	if (location === "ALL") {
		return "전체";
	}
	return getRegionLabel(location as RegionCode);
};

export const formatDesiredParticipantsLabel = (
	participants: string | number,
): string => {
	if (!participants) return "선택 안함";
	const countStr =
		typeof participants === "number" ? String(participants) : participants;
	return countStr.endsWith("명") ? countStr : `${countStr}명`;
};

export const calculateEstimatePrice = (estimate: Estimate): PriceBreakdown => {
	const basePrice = getBasePrice(estimate.desiredParticipants);
	const ageSurcharge = getAgeSurcharge(
		estimate.ages,
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

	const total = basePrice + ageSurcharge + locationSurcharge + genderSurcharge;

	return {
		desiredParticipants: {
			label: formatDesiredParticipantsLabel(estimate.desiredParticipants),
			price: basePrice,
		},
		gender: {
			label:
				getGenderLabel(estimate.gender as GenderCode) ||
				(estimate.gender === "ALL" ? "전체" : "선택 안함"),
			price: genderSurcharge,
		},
		age: {
			label: formatAgeLabel(estimate.ages),
			price: ageSurcharge,
		},
		location: {
			label: (() => {
				const baseLabel = formatLocationLabel(estimate.location);
				if (!estimate.location || estimate.location === "ALL") {
					return baseLabel;
				}
				const difficulty = getLocationDifficulty(estimate.location);
				return difficulty ? `${baseLabel} ${difficulty}` : baseLabel;
			})(),
			price: locationSurcharge,
		},
		total,
	};
};

export const calculateTotalPrice = (estimate: Estimate): number => {
	const breakdown = calculateEstimatePrice(estimate);
	return breakdown.total;
};

export const formatPrice = (price: number): string => {
	return `${price.toLocaleString("ko-KR")}원`;
};

export const formatPriceAsCoin = (price: number): string => {
	return `${price.toLocaleString("ko-KR")}코인`;
};
