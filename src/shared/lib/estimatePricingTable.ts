import type {
	AgeCode,
	QuestionCountRange,
} from "../../features/payment/constants/payment";
import type { Estimate } from "../contexts/PaymentContext";

// 견적서 성별·연령 조합
export type EstimateTargetingPreset =
	| "all_all"
	| "single_gender_all_age"
	| "all_gender_multi_age"
	| "single_gender_multi_age"
	| "all_gender_single_age"
	| "single_gender_single_age";

export const PARTICIPANT_TIERS = [50, 100, 150, 200] as const;
export type ParticipantTier = (typeof PARTICIPANT_TIERS)[number];

export const ESTIMATE_TARGETING_LABEL: Record<EstimateTargetingPreset, string> =
	{
		all_all: "전체 / 전체",
		single_gender_all_age: "단일성별 / 전체연령",
		all_gender_multi_age: "전체성별 / 복수연령",
		single_gender_multi_age: "단일성별 / 복수연령",
		all_gender_single_age: "전체성별 / 단일연령",
		single_gender_single_age: "단일성별 / 단일연령",
	};

// 응답자 수 · 문항 구간 · 타게팅 프리셋별 견적 금액 (원)
export const ESTIMATE_PRICE_TABLE: Record<
	ParticipantTier,
	Record<QuestionCountRange, Record<EstimateTargetingPreset, number>>
> = {
	50: {
		"1~30": {
			all_all: 18_500,
			single_gender_all_age: 23_500,
			all_gender_multi_age: 23_500,
			single_gender_multi_age: 28_500,
			all_gender_single_age: 33_500,
			single_gender_single_age: 33_500,
		},
		"31~50": {
			all_all: 40_000,
			single_gender_all_age: 45_000,
			all_gender_multi_age: 45_000,
			single_gender_multi_age: 50_000,
			all_gender_single_age: 55_000,
			single_gender_single_age: 55_000,
		},
	},
	100: {
		"1~30": {
			all_all: 37_000,
			single_gender_all_age: 42_000,
			all_gender_multi_age: 42_000,
			single_gender_multi_age: 47_000,
			all_gender_single_age: 52_000,
			single_gender_single_age: 52_000,
		},
		"31~50": {
			all_all: 78_000,
			single_gender_all_age: 83_000,
			all_gender_multi_age: 83_000,
			single_gender_multi_age: 88_000,
			all_gender_single_age: 93_000,
			single_gender_single_age: 93_000,
		},
	},
	150: {
		"1~30": {
			all_all: 55_500,
			single_gender_all_age: 60_500,
			all_gender_multi_age: 60_500,
			single_gender_multi_age: 65_500,
			all_gender_single_age: 70_500,
			single_gender_single_age: 70_500,
		},
		"31~50": {
			all_all: 117_000,
			single_gender_all_age: 122_000,
			all_gender_multi_age: 122_000,
			single_gender_multi_age: 127_000,
			all_gender_single_age: 132_000,
			single_gender_single_age: 132_000,
		},
	},
	200: {
		"1~30": {
			all_all: 74_000,
			single_gender_all_age: 79_000,
			all_gender_multi_age: 79_000,
			single_gender_multi_age: 84_000,
			all_gender_single_age: 89_000,
			single_gender_single_age: 89_000,
		},
		"31~50": {
			all_all: 155_000,
			single_gender_all_age: 160_000,
			all_gender_multi_age: 160_000,
			single_gender_multi_age: 165_000,
			all_gender_single_age: 170_000,
			single_gender_single_age: 170_000,
		},
	},
};

/** 구글폼 변환(all_all) 견적 공급가(원) — 앱·견적 안내와 동일 */
export const GOOGLE_FORM_CONVERSION_IAP_EXPECTED_PRICES: readonly number[] =
	PARTICIPANT_TIERS.flatMap((tier) =>
		(["1~30", "31~50"] as const).map(
			(q) => ESTIMATE_PRICE_TABLE[tier][q].all_all,
		),
	);

/** 인앱 스토어 표시용 판매가(원, 공급가×1.1 반올림) — `displayAmount`와 맞출 것 */
export const GOOGLE_FORM_CONVERSION_IAP_RETAIL_PRICES: readonly number[] =
	GOOGLE_FORM_CONVERSION_IAP_EXPECTED_PRICES.map((won) =>
		Math.round(won * 1.1),
	);

export const parseParticipantTier = (
	participants: string,
): ParticipantTier | null => {
	const digitsOnly = participants.replace(/[^\d]/g, "");
	const n = digitsOnly ? parseInt(digitsOnly, 10) : 0;
	return PARTICIPANT_TIERS.includes(n as ParticipantTier)
		? (n as ParticipantTier)
		: null;
};

const isAgeTargetingAll = (ages: AgeCode[]): boolean => {
	if (ages.length === 0) return true;
	if (ages.length === 1 && ages[0] === "ALL") return true;
	return false;
};

const getSpecificAges = (ages: AgeCode[]): AgeCode[] =>
	ages.filter((a) => a !== "ALL");

// 현재 견적 선택값에 대응하는 견적서 타게팅 프리셋
export const getEstimateTargetingPreset = (
	estimate: Estimate,
): EstimateTargetingPreset => {
	const isGenderAll = estimate.gender === "ALL";
	const ageAll = isAgeTargetingAll(estimate.ages);
	const specificAges = getSpecificAges(estimate.ages);
	const n = specificAges.length;

	if (isGenderAll && ageAll) return "all_all";
	if (!isGenderAll && ageAll) return "single_gender_all_age";
	if (isGenderAll && n >= 2) return "all_gender_multi_age";
	if (!isGenderAll && n >= 2) return "single_gender_multi_age";
	if (isGenderAll && n === 1) return "all_gender_single_age";
	if (!isGenderAll && n === 1) return "single_gender_single_age";
	return "all_all";
};

export const getEstimateTargetingSummaryLabel = (
	estimate: Estimate,
): string => {
	const preset = getEstimateTargetingPreset(estimate);
	return ESTIMATE_TARGETING_LABEL[preset];
};

// 견적서 표 기준 총액 (원). 조합이 표에 없으면 0.
export const lookupEstimateTablePrice = (estimate: Estimate): number => {
	const tier = parseParticipantTier(estimate.desiredParticipants);
	if (!tier) return 0;

	const q = estimate.questionCount;
	const preset = getEstimateTargetingPreset(estimate);

	return ESTIMATE_PRICE_TABLE[tier][q][preset] ?? 0;
};

/** 구글폼 변환 신청: 견적표와 동일 금액(성별·연령 전체 / all_all) */
export const getGoogleFormConversionTablePrice = (
	participantTier: ParticipantTier,
	questionRange: QuestionCountRange,
): number => {
	const estimate: Estimate = {
		date: null,
		location: "ALL",
		ages: ["ALL"],
		gender: "ALL",
		desiredParticipants: String(participantTier),
		questionCount: questionRange,
	};
	return lookupEstimateTablePrice(estimate);
};
