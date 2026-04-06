import {
	mapBackendQuestionType,
	type TransformedSurveyQuestion,
} from "@features/survey/service/surveyParticipation";
import type {
	FormRequestValidationConvertibleQuestionInfo,
	FormRequestValidationConvertibleSection,
} from "../service/api";

const PREVIEW_SURVEY_ID = 0;

/** 섹션 인덱스·문항 인덱스로 참여 화면용 문항 ID 부여 (미리보기 전용) */
export const makePreviewQuestionId = (
	sectionIndex: number,
	questionIndex: number,
) => sectionIndex * 10_000 + questionIndex;

export type GoogleFormPreviewSection = {
	currSection: number;
	sectionTitle: string;
	sectionDescription: string;
	questions: TransformedSurveyQuestion[];
};

export const mapRawToPreviewQuestion = (
	raw: FormRequestValidationConvertibleQuestionInfo,
	section: FormRequestValidationConvertibleSection,
	sectionIndex: number,
	questionIndex: number,
): TransformedSurveyQuestion => {
	const questionId = makePreviewQuestionId(sectionIndex, questionIndex);
	const type = mapBackendQuestionType(
		String(raw.questionType ?? "").toUpperCase(),
	);
	const description = raw.description ?? "";

	const base: TransformedSurveyQuestion = {
		questionId,
		surveyId: PREVIEW_SURVEY_ID,
		type,
		title: raw.title ?? "",
		description,
		isRequired: raw.isRequired ?? true,
		questionOrder: raw.questionOrder ?? questionIndex + 1,
		section: raw.section ?? section.currSection,
		...(raw.imageUrl != null && raw.imageUrl !== ""
			? { imageUrl: raw.imageUrl }
			: {}),
	};

	if (type === "rating") {
		base.minValue = raw.minValue ?? "";
		base.maxValue = raw.maxValue ?? "";
		if (raw.rate != null) base.rate = raw.rate;
	}

	if (type === "multipleChoice") {
		base.maxChoice = raw.maxChoice ?? 1;
		base.hasNoneOption = raw.hasNoneOption;
		base.hasCustomInput = raw.hasCustomInput;
		base.isSectionDecidable = raw.isSectionDecidable;
		base.options = (raw.options ?? []).map((opt, idx) => ({
			optionId: opt.optionId ?? idx,
			content: opt.content ?? "",
			nextQuestionId: 0,
			order: idx,
			...(opt.nextSection != null && typeof opt.nextSection === "number"
				? { nextSection: opt.nextSection }
				: {}),
			...(opt.imageUrl != null && opt.imageUrl !== ""
				? { imageUrl: opt.imageUrl }
				: {}),
		}));
	}

	if (type === "image" && !base.imageUrl) {
		base.type = "shortAnswer";
	}

	return base;
};

/**
 * 검증 API `convertibleDetails` → 설문 참여 {@link QuestionRenderer} 입력 형태
 */
export const mapConvertibleDetailsToPreviewSections = (
	sections: FormRequestValidationConvertibleSection[],
): GoogleFormPreviewSection[] =>
	sections.map((section, sectionIndex) => ({
		currSection: section.currSection,
		sectionTitle: section.sectionTitle ?? "",
		sectionDescription: section.sectionDescription ?? "",
		questions: (section.info ?? []).map((raw, questionIndex) =>
			mapRawToPreviewQuestion(raw, section, sectionIndex, questionIndex),
		),
	}));
