import type { QuestionPackage, RespondentCount } from "./types";

export const RESPONDENT_OPTIONS: {
	label: string;
	value: RespondentCount;
	display: string;
}[] = [
	{ label: "50명", value: 50, display: "50명" },
	{ label: "100명", value: 100, display: "100명" },
	{ label: "150명", value: 150, display: "150명" },
	{ label: "200명", value: 200, display: "200명" },
	{ label: "250명", value: 250, display: "250명" },
	{ label: "300명", value: 300, display: "300명" },
];

export const PRICE_TABLE: Record<
	QuestionPackage,
	Record<RespondentCount, number>
> = {
	light: {
		50: 10890,
		100: 19690,
		150: 28490,
		200: 37290,
		250: 46090,
		300: 54890,
	},
	standard: {
		50: 16390,
		100: 29590,
		150: 42790,
		200: 55990,
		250: 69190,
		300: 82390,
	},
	plus: {
		50: 21890,
		100: 39490,
		150: 57090,
		200: 74690,
		250: 92290,
		300: 109890,
	},
};
