import { saveBase64Data } from "@apps-in-toss/web-framework";
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
import {
	downloadSurveyAnswerCsv,
	type SurveyAnswerDetailFilters,
} from "../../service/mysurvey/api";
import type { SurveyAnswerDetailInfo } from "../../service/mysurvey/types";
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
	const [isDownloading, setIsDownloading] = useState(false);

	const handleDownloadCsv = async () => {
		if (!surveyId || !surveyResponse || isDownloading) {
			return;
		}

		try {
			setIsDownloading(true);

			const { blob, filename } = await downloadSurveyAnswerCsv(
				Number(surveyId),
			);

			// blob을 base64로 변환하여 saveBase64Data로 저장
			const base64data = await new Promise<string>((resolve, reject) => {
				const reader = new FileReader();
				reader.onloadend = () => {
					const result = reader.result as string;
					// data:application/octet-stream;base64, 부분 제거
					const base64 = result.split(",")[1];
					resolve(base64);
				};
				reader.onerror = reject;
				reader.readAsDataURL(blob);
			});

			await saveBase64Data({
				data: base64data,
				fileName: filename,
				mimeType: "text/csv",
			});
		} catch (error) {
			console.error("CSV 다운로드 실패:", error);
		} finally {
			setIsDownloading(false);
		}
	};

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
			(detail: SurveyAnswerDetailInfo) =>
				String(detail.questionId) === questionId,
		);

		if (!questionDetail) return;

		const path = getQuestionResultRoute(type);

		const responseCount =
			(questionDetail.type === "CHOICE" ||
				questionDetail.type === "RATING" ||
				questionDetail.type === "NPS") &&
			questionDetail.answerMap
				? (Object.values(questionDetail.answerMap) as number[]).reduce(
						(sum, count) => sum + (count as number),
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
		<div
			className="flex flex-col w-full h-screen bg-white"
			style={{ "--top-background-color": badge.color } as React.CSSProperties}
		>
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
				<Button
					display="block"
					disabled={isDownloading || !surveyResponse}
					onClick={handleDownloadCsv}
					style={
						{ "--button-background-color": "#15c67f" } as React.CSSProperties
					}
				>
					결과 다운받기
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
								<div className="[&_button]:!text-[#15c67f]">
									<Button
										size="medium"
										variant="weak"
										onClick={() =>
											handleResultNavigation(question.type, question.id)
										}
										style={
											{
												"--button-background-color": "#f0faf6",
											} as React.CSSProperties
										}
									>
										{question.responseCount}명
									</Button>
								</div>
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
