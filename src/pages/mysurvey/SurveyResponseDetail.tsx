import { adaptive } from "@toss/tds-colors";
import { Asset, Button, List, ListRow, Top } from "@toss/tds-mobile";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BottomNavigation } from "../../components/BottomNavigation";
import {
	type AgeCode,
	type GenderCode,
	getAgeCodeFromLabel,
	getAgeLabelSimple,
	getGenderCodeFromLabel,
	getGenderLabel,
} from "../../constants/payment";
import {
	getRegionCodeFromLabel,
	getRegionLabelFromCode,
} from "../../constants/regions";
import {
	QUESTION_TYPE_LABELS,
	SURVEY_BADGE_CONFIG,
	SURVEY_STATUS_LABELS,
} from "../../constants/survey";
import { useSurveyAnswerDetail } from "../../hooks/useSurveyAnswerDetail";
import { useSurveyFilters } from "../../hooks/useSurveyFilters";
import type { SurveyAnswerDetailFilters } from "../../service/mysurvey/api";
import type { QuestionType } from "../../types/survey";
import { getQuestionResultRoute } from "../../utils/questionRoute";
import { SurveyFilterBottomSheet } from "./components/SurveyFilterBottomSheet";

export const SurveyResponseDetail = () => {
	const navigate = useNavigate();
	const { surveyId } = useParams<{ surveyId: string }>();
	const [isFilterOpen, setIsFilterOpen] = useState(false);

	const { filters, applyFilters } = useSurveyFilters();
	const { surveyResponse, answerDetails } = useSurveyAnswerDetail(
		surveyId,
		filters,
	);

	if (!surveyResponse) {
		return null;
	}

	const badge = SURVEY_BADGE_CONFIG[surveyResponse.status];

	const handleGoMySurvey = () => {
		navigate("/mysurvey");
	};

	const handleGoMyPage = () => {
		navigate("/mypage");
	};

	const getQuestionTypeLabel = (type: string, required: boolean) => {
		const requiredLabel = required ? "필수" : "선택";
		const typeLabel = QUESTION_TYPE_LABELS[type] || type;
		return `${requiredLabel} / ${typeLabel}`;
	};

	const handleResultNavigation = (type: QuestionType, questionId: string) => {
		if (!answerDetails) return;

		const questionDetail = answerDetails.detailInfoList.find(
			(detail) => String(detail.questionId) === questionId,
		);

		if (!questionDetail) return;

		const path = getQuestionResultRoute(type);

		const responseCount =
			(questionDetail.type === "CHOICE" ||
				questionDetail.type === "RATING" ||
				questionDetail.type === "NPS") &&
			questionDetail.answerMap
				? Object.values(questionDetail.answerMap).reduce(
						(sum, count) => sum + count,
						0,
					)
				: questionDetail.answerList?.length || 0;

		navigate(path, {
			state: {
				question: {
					id: questionDetail.questionId,
					title: questionDetail.title,
					description: questionDetail.description,
					type,
					isRequired: questionDetail.isRequired,
					order: questionDetail.order,
					rate: questionDetail.rate,
				},
				answerMap: questionDetail.answerMap || {},
				answerList: questionDetail.answerList || [],
				surveyTitle: surveyResponse?.title || "",
				surveyStatus: surveyResponse?.status || "active",
				responseCount,
				surveyId: Number(surveyId),
				filters,
			},
		});
	};

	return (
		<div className="flex flex-col w-full h-screen bg-white">
			<Top
				title={
					<Top.TitleParagraph size={22} color={adaptive.grey900}>
						{surveyResponse.title}
					</Top.TitleParagraph>
				}
				subtitleTop={
					<Top.SubtitleBadges
						badges={[
							{
								text: SURVEY_STATUS_LABELS[surveyResponse.status],
								color: badge.color,
								variant: "weak",
							},
						]}
					/>
				}
				subtitleBottom={
					<Top.SubtitleParagraph size={15}>
						{surveyResponse.responseCount}명 응답
					</Top.SubtitleParagraph>
				}
			/>
			<div className="px-4">
				<Button variant="weak" display="block">
					CSV로 결과받기
				</Button>
			</div>
			<div className="h-4" />

			<div className="flex-1 overflow-y-auto pb-24">
				<List>
					<ListRow
						contents={
							<ListRow.Texts
								type="2RowTypeC"
								top="설문 질문"
								topProps={{ color: adaptive.grey800, fontWeight: "bold" }}
								bottom=""
								bottomProps={{ color: adaptive.grey500 }}
							/>
						}
						right={
							<button
								type="button"
								onClick={() => setIsFilterOpen(true)}
								aria-label="필터 열기"
							>
								<Asset.Icon
									frameShape={{ width: 18, height: 18 }}
									name="icon-filter-mono"
									color={adaptive.grey600}
									aria-hidden={true}
								/>
							</button>
						}
						verticalPadding="small"
						horizontalPadding="small"
					/>
					{surveyResponse.questions.map((question) => (
						<ListRow
							key={question.id}
							contents={
								<ListRow.Texts
									type="2RowTypeA"
									top={`${question.order !== undefined ? question.order + 1 : parseInt(question.id, 10)}. ${question.title}`}
									topProps={{ color: adaptive.grey800, fontWeight: "bold" }}
									bottom={getQuestionTypeLabel(
										question.type,
										question.required,
									)}
									bottomProps={{ color: adaptive.grey600 }}
								/>
							}
							right={
								<Button
									size="medium"
									variant="weak"
									onClick={() =>
										handleResultNavigation(question.type, question.id)
									}
								>
									{question.responseCount}명
								</Button>
							}
							verticalPadding="large"
						/>
					))}
				</List>
			</div>

			<BottomNavigation
				currentPage="mysurvey"
				onMySurveyClick={handleGoMySurvey}
				onMyPageClick={handleGoMyPage}
			/>
			<SurveyFilterBottomSheet
				open={isFilterOpen}
				onClose={() => setIsFilterOpen(false)}
				surveyInfo={answerDetails?.surveyInfo}
				initialAges={
					filters.ages
						? filters.ages.map((age) => getAgeLabelSimple(age as AgeCode))
						: []
				}
				initialGenders={
					filters.genders
						? filters.genders.map((gender) =>
								getGenderLabel(gender as GenderCode),
							)
						: []
				}
				initialLocations={
					filters.residences
						? filters.residences.map((residence) =>
								getRegionLabelFromCode(residence),
							)
						: []
				}
				onApplyFilters={(selectedAges, selectedGenders, selectedLocations) => {
					const filterParams: SurveyAnswerDetailFilters = {};

					const ageCodes = selectedAges
						.map(getAgeCodeFromLabel)
						.filter((code) => code !== null && code !== "ALL")
						.map((code) => code as string);
					if (ageCodes.length > 0) filterParams.ages = ageCodes;

					const genderCodes = selectedGenders
						.map(getGenderCodeFromLabel)
						.filter((code) => code !== null && code !== "ALL")
						.map((code) => code as string);
					if (genderCodes.length > 0) filterParams.genders = genderCodes;

					const locationCodes = selectedLocations
						.map(getRegionCodeFromLabel)
						.filter((code): code is string => code !== null && code !== "ALL");
					if (locationCodes.length > 0) filterParams.residences = locationCodes;

					applyFilters(filterParams);
					setIsFilterOpen(false);
				}}
			/>
		</div>
	);
};
