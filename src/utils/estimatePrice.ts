import {
	type AgeCode,
	type GenderCode,
	getAgeLabel,
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

const getBasePrice = (participants: string): number => {
	const count = parseInt(participants.replace("명", ""), 10);
	if (Number.isNaN(count)) return 0;
	return count * 550;
};

const getAgeSurcharge = (age: string, participants: string): number => {
	if (age === "ALL") {
		return 0;
	}

	const count = parseInt(participants.replace("명", ""), 10);
	if (Number.isNaN(count)) return 0;

	const ageMatches = age.match(/\d+대/g);
	const isMultipleAges = ageMatches ? ageMatches.length > 1 : false;

	if (isMultipleAges) {
		return count * 140;
	} else {
		return count * 105;
	}
};

const getLocationSurcharge = (
	location: string,
	participants: string,
): number => {
	if (location === "ALL") {
		return 0;
	}

	const count = parseInt(participants.replace("명", ""), 10);
	if (Number.isNaN(count)) return 0;

	if (
		REGIONS_5_PERCENT_SURCHARGE.some((region) =>
			location.includes(region.value),
		)
	) {
		return count * 35;
	} else if (
		REGIONS_10_PERCENT_SURCHARGE.some((region) =>
			location.includes(region.value),
		)
	) {
		return count * 70;
	} else if (
		REGIONS_15_PERCENT_SURCHARGE.some((region) =>
			location.includes(region.value),
		)
	) {
		return count * 105;
	}

	return 0;
};

const getGenderSurcharge = (gender: string, participants: string): number => {
	if (gender === "ALL") {
		return 0;
	}

	const count = parseInt(participants.replace("명", ""), 10);
	if (Number.isNaN(count)) return 0;
	return count * 70;
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

const formatAgeLabel = (age: string): string => {
	if (age === "ALL") {
		return "전체";
	}
	if (!age) {
		return "선택 안함";
	}

	return age
		.split(", ")
		.map((code) =>
			getAgeLabel(code as AgeCode)
				.replace(/\s*\(.*?\)/, "")
				.trim(),
		)
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

const formatDesiredParticipantsLabel = (participants: string): string => {
	if (!participants) return "선택 안함";
	return participants.endsWith("명") ? participants : `${participants}명`;
};

export const calculateEstimatePrice = (estimate: Estimate): PriceBreakdown => {
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
			label: formatAgeLabel(estimate.age),
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
