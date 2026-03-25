import {
	AGE_LABEL_MAP,
	type AgeCode,
	getRegionLabel,
	REGIONS_5_PERCENT_SURCHARGE,
	REGIONS_10_PERCENT_SURCHARGE,
	REGIONS_15_PERCENT_SURCHARGE,
	REGIONS_NO_SURCHARGE,
	type RegionCode,
} from "../../features/payment/constants/payment";
import type { Estimate } from "../contexts/PaymentContext";
import {
	getEstimateTargetingSummaryLabel,
	lookupEstimateTablePrice,
} from "./estimatePricingTable";

export interface PriceBreakdown {
	desiredParticipants: { label: string };
	questionCount: { label: string };
	targetingSummary: string;
	location: { label: string };
	total: number;
}

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
	const total = lookupEstimateTablePrice(estimate);

	return {
		desiredParticipants: {
			label: formatDesiredParticipantsLabel(estimate.desiredParticipants),
		},
		questionCount: { label: estimate.questionCount },
		targetingSummary: getEstimateTargetingSummaryLabel(estimate),
		location: {
			label: (() => {
				const baseLabel = formatLocationLabel(estimate.location);
				if (!estimate.location || estimate.location === "ALL") {
					return baseLabel;
				}
				const difficulty = getLocationDifficulty(estimate.location);
				return difficulty ? `${baseLabel} ${difficulty}` : baseLabel;
			})(),
		},
		total,
	};
};

export const calculateTotalPrice = (estimate: Estimate): number => {
	return calculateEstimatePrice(estimate).total;
};

export const formatPrice = (price: number): string => {
	return `${price.toLocaleString("ko-KR")}원`;
};

export const formatPriceAsCoin = (price: number): string => {
	return `${price.toLocaleString("ko-KR")}코인`;
};
