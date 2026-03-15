import type { AgeCode, GenderCode } from "@features/payment/constants/payment";

export type QuestionPackage = "light" | "standard" | "plus";

export type RespondentCount = 50 | 100 | 150 | 200 | 250 | 300;

export type FormValues = {
	formLink: string;
	email: string;
	/** 선택 입력. 입력 시 API로 유효 여부 검사 후 일치하면 별도 페이지로 리다이렉트 */
	promotionCode?: string;
	respondentCount: RespondentCount;
	deadline: Date;
	gender: GenderCode;
	ages: AgeCode[];
};
