export const DESIRED_PARTICIPANTS = [
	{ name: "50명", value: "50", hideUnCheckedCheckBox: false },
	{ name: "100명", value: "100", hideUnCheckedCheckBox: false },
	{ name: "150명", value: "150", hideUnCheckedCheckBox: false },
	{ name: "200명", value: "200", hideUnCheckedCheckBox: false },
];

export type GenderCode = "ALL" | "MALE" | "FEMALE";
export type AgeCode =
	| "ALL"
	| "TEN"
	| "TWENTY"
	| "THIRTY"
	| "FOURTY"
	| "FIFTY"
	| "SIXTY"
	| "OVER";
export type RegionCode =
	| "ALL"
	| "GANGWON"
	| "GYEONGGI"
	| "GYEONGNAM"
	| "GYEONGBUK"
	| "GWANGJU"
	| "DAEGU"
	| "DAEJEON"
	| "BUSAN"
	| "SEOUL"
	| "ULSAN"
	| "INCHEON"
	| "JEONNAM"
	| "JEONBUK"
	| "JEJU"
	| "CHUNGNAM"
	| "CHUNGBUK"
	| "SEJONG";

type SelectOption<T extends string> = {
	name: string;
	value: T;
	hideUnCheckedCheckBox?: boolean;
};

export const GENDER: SelectOption<GenderCode>[] = [
	{ name: "전체", value: "ALL", hideUnCheckedCheckBox: false },
	{ name: "남성", value: "MALE", hideUnCheckedCheckBox: false },
	{ name: "여성", value: "FEMALE", hideUnCheckedCheckBox: false },
];

export const AGE: SelectOption<AgeCode>[] = [
	{ name: "전체", value: "ALL", hideUnCheckedCheckBox: false },
	{ name: "10대(10세~19세)", value: "TEN", hideUnCheckedCheckBox: false },
	{ name: "20대(20세~29세)", value: "TWENTY", hideUnCheckedCheckBox: false },
	{ name: "30대(30세~39세)", value: "THIRTY", hideUnCheckedCheckBox: false },
	{ name: "40대(40세~49세)", value: "FOURTY", hideUnCheckedCheckBox: false },
	{ name: "50대(50세~59세)", value: "FIFTY", hideUnCheckedCheckBox: false },
	{ name: "60대(60세~69세)", value: "SIXTY", hideUnCheckedCheckBox: false },
	{ name: "70대 이상", value: "OVER", hideUnCheckedCheckBox: false },
];

export enum EstimateField {
	Age = "age",
	Gender = "gender",
	DesiredParticipants = "desiredParticipants",
}

export type CoinOption = {
	amount: number;
	price: string;
};

export type RegionOption = {
	label: string;
	value: RegionCode;
};

export const REGIONS_NO_SURCHARGE: RegionOption[] = [
	{ label: "전체", value: "ALL" },
];
export const REGIONS_5_PERCENT_SURCHARGE: RegionOption[] = [
	{ label: "서울", value: "SEOUL" },
	{ label: "경기", value: "GYEONGGI" },
];
export const REGIONS_10_PERCENT_SURCHARGE: RegionOption[] = [
	{ label: "인천", value: "INCHEON" },
	{ label: "대전", value: "DAEJEON" },
	{ label: "세종", value: "SEJONG" },
	{ label: "부산", value: "BUSAN" },
	{ label: "울산", value: "ULSAN" },
	{ label: "대구", value: "DAEGU" },
	{ label: "광주", value: "GWANGJU" },
];
export const REGIONS_15_PERCENT_SURCHARGE: RegionOption[] = [
	{ label: "강원", value: "GANGWON" },
	{ label: "충북", value: "CHUNGBUK" },
	{ label: "충남", value: "CHUNGNAM" },
	{ label: "전북", value: "JEONBUK" },
	{ label: "전남", value: "JEONNAM" },
	{ label: "경북", value: "GYEONGBUK" },
	{ label: "경남", value: "GYEONGNAM" },
	{ label: "제주", value: "JEJU" },
];

const buildLabelMap = <T extends string>(
	options: SelectOption<T>[],
): Record<T, string> => {
	return options.reduce(
		(acc, option) => {
			acc[option.value] = option.name;
			return acc;
		},
		{} as Record<T, string>,
	);
};

const mergeRegionLabelMap = (
	...groups: RegionOption[][]
): Record<RegionCode, string> => {
	return groups.reduce(
		(acc, group) => {
			group.forEach((option) => {
				acc[option.value] = option.label;
			});
			return acc;
		},
		{} as Record<RegionCode, string>,
	);
};

export const GENDER_LABEL_MAP = buildLabelMap(GENDER);
export const AGE_LABEL_MAP = buildLabelMap(AGE);

const REGION_LABEL_MAP = mergeRegionLabelMap(
	REGIONS_NO_SURCHARGE,
	REGIONS_5_PERCENT_SURCHARGE,
	REGIONS_10_PERCENT_SURCHARGE,
	REGIONS_15_PERCENT_SURCHARGE,
);

export const getGenderLabel = (value: GenderCode): string =>
	GENDER_LABEL_MAP[value] ?? "";
export const getAgeLabel = (value: AgeCode): string =>
	AGE_LABEL_MAP[value] ?? "";
export const getRegionLabel = (value: RegionCode): string =>
	REGION_LABEL_MAP[value] ?? "";
