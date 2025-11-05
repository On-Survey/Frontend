export const DESIRED_PARTICIPANTS = [
	{ name: "50명", value: "50", hideUnCheckedCheckBox: false },
	{ name: "100명", value: "100", hideUnCheckedCheckBox: false },
	{ name: "150명", value: "150", hideUnCheckedCheckBox: false },
	{ name: "200명", value: "200", hideUnCheckedCheckBox: false },
];

export const GENDER = [
	{ name: "전체", value: "전체", hideUnCheckedCheckBox: false },
	{ name: "남성", value: "남성", hideUnCheckedCheckBox: false },
	{ name: "여성", value: "여성", hideUnCheckedCheckBox: false },
];

export const AGE = [
	{ name: "전체", value: "전체", hideUnCheckedCheckBox: false },
	{
		name: "20대(20세~29세)",
		value: "20대(20세~29세)",
		hideUnCheckedCheckBox: false,
	},
	{
		name: "30대(30세~39세)",
		value: "30대(30세~39세)",
		hideUnCheckedCheckBox: false,
	},
	{
		name: "40대(40세~49세)",
		value: "40대(40세~49세)",
		hideUnCheckedCheckBox: false,
	},
	{
		name: "50대(50세~59세)",
		value: "50대(50세~59세)",
		hideUnCheckedCheckBox: false,
	},
	{
		name: "60대(60세~69세)",
		value: "60대(60세~69세)",
		hideUnCheckedCheckBox: false,
	},
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

export const COIN_OPTIONS: CoinOption[] = [
	{ amount: 10000, price: "10,000원" },
	{ amount: 20000, price: "20,000원" },
	{ amount: 30000, price: "30,000원" },
	{ amount: 40000, price: "40,000원" },
	{ amount: 50000, price: "50,000원" },
];
