import { adaptive } from "@toss/tds-colors";
import { Asset, Button, List, ListRow, Top } from "@toss/tds-mobile";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BottomNavigation } from "../../components/BottomNavigation";
import {
	getAgeCodeFromLabel,
	getGenderCodeFromLabel,
} from "../../constants/payment";
import { getRegionCodeFromLabel } from "../../constants/regions";
import {
	QUESTION_TYPE_LABELS,
	SURVEY_BADGE_CONFIG,
	SURVEY_STATUS_LABELS,
} from "../../constants/survey";
import {
	getSurveyAnswerDetail,
	getUserSurveys,
	type SurveyAnswerDetailFilters,
} from "../../service/mysurvey/api";
import type { SurveyAnswerDetailResult } from "../../service/mysurvey/types";
import type { QuestionType } from "../../types/survey";
import type { SurveyResponseDetail as SurveyResponseDetailType } from "../../types/surveyResponse";
import { mapApiQuestionTypeToComponentType } from "../../utils/questionFactory";
import { getQuestionResultRoute } from "../../utils/questionRoute";
import { SurveyFilterBottomSheet } from "./components/SurveyFilterBottomSheet";

export const SurveyResponseDetail = () => {
	const navigate = useNavigate();
	const { surveyId } = useParams<{ surveyId: string }>();
	const [isFilterOpen, setIsFilterOpen] = useState(false);
	const [surveyResponse, setSurveyResponse] =
		useState<SurveyResponseDetailType | null>(null);
	const [answerDetails, setAnswerDetails] =
		useState<SurveyAnswerDetailResult | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [filters, setFilters] = useState<SurveyAnswerDetailFilters>({});
	const [userSurveysResult, setUserSurveysResult] = useState<Awaited<
		ReturnType<typeof getUserSurveys>
	> | null>(null);
	const [userSurveysLoaded, setUserSurveysLoaded] = useState(false);

	// 초기 로드
	useEffect(() => {
		const fetchUserSurveys = async () => {
			try {
				const result = await getUserSurveys();
				setUserSurveysResult(result);
			} catch (error) {
				console.error("getUserSurveys 실패:", error);
				setUserSurveysResult(null);
			} finally {
				setUserSurveysLoaded(true);
			}
		};

		void fetchUserSurveys();
	}, []);

	// 필터 변경 시 호출
	const fetchSurveyDetail = useCallback(async () => {
		if (!surveyId) return;

		try {
			setIsLoading(true);
			const result = await getSurveyAnswerDetail(Number(surveyId), filters);

			if (!result) {
				const survey = userSurveysResult?.infoList.find(
					(s) => s.surveyId === Number(surveyId),
				);
				setSurveyResponse({
					id: Number(surveyId),
					title: survey?.title || "설문",
					status: "active",
					responseCount: survey?.currentCount ?? 0,
					questions: [],
				});
				return;
			}

			setAnswerDetails(result);

			const survey = userSurveysResult?.infoList.find(
				(s) => s.surveyId === result.surveyId,
			);
			const status: "active" | "closed" =
				result.status === "ONGOING" || result.status === "ACTIVE"
					? "active"
					: "closed";

			const questions = result.detailInfoList.map((detail) => {
				const questionType = mapApiQuestionTypeToComponentType(detail.type);
				const responseCount =
					detail.type === "CHOICE" && detail.answerMap
						? Object.values(detail.answerMap).reduce(
								(sum, count) => sum + count,
								0,
							)
						: detail.answerList?.length || 0;

				return {
					id: String(detail.questionId),
					title: detail.title,
					type: questionType,
					required: detail.isRequired,
					responseCount,
					order: detail.order,
				};
			});

			setSurveyResponse({
				id: result.surveyId,
				title: survey?.title || result.surveyId.toString() || "설문",
				status,
				responseCount: result.currentCount,
				questions,
			});
		} catch (_error) {
			const survey = userSurveysResult?.infoList.find(
				(s) => s.surveyId === Number(surveyId),
			);
			setSurveyResponse({
				id: Number(surveyId),
				title: survey?.title || "설문",
				status: "active",
				responseCount: 0,
				questions: [],
			});
		} finally {
			setIsLoading(false);
		}
	}, [surveyId, filters, userSurveysResult]);

	useEffect(() => {
		if (userSurveysLoaded) {
			void fetchSurveyDetail();
		}
	}, [userSurveysLoaded, fetchSurveyDetail]);

	if (isLoading || !surveyResponse) {
		return (
			<div className="flex flex-col w-full h-screen bg-white items-center justify-center text-gray-500">
				<div>설문 결과를 불러오는 중이에요</div>
			</div>
		);
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
			questionDetail.type === "CHOICE" && questionDetail.answerMap
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

					setFilters(filterParams);
					setIsFilterOpen(false);
				}}
			/>
		</div>
	);
};
