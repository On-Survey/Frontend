import { partner, tdsEvent } from "@apps-in-toss/web-framework";
import { adaptive } from "@toss/tds-colors";
import { Asset, Button, List, ListRow, Top } from "@toss/tds-mobile";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BottomNavigation } from "../../components/BottomNavigation";
import {
	QUESTION_TYPE_LABELS,
	SURVEY_BADGE_CONFIG,
	SURVEY_STATUS_LABELS,
} from "../../constants/survey";
import {
	getSurveyAnswerDetail,
	getUserSurveys,
} from "../../service/mysurvey/api";
import type { SurveyAnswerDetailResult } from "../../service/mysurvey/types";
import type { QuestionType } from "../../types/survey";
import type { SurveyResponseDetail as SurveyResponseDetailType } from "../../types/surveyResponse";
import { mapApiQuestionTypeToComponentType } from "../../utils/questionFactory";
import { getQuestionResultRoute } from "../../utils/questionRoute";
import { SurveyFilterBottomSheet } from "./components/SurveyFilterBottomSheet";

export const SurveyResponseDetail = () => {
	const navigate = useNavigate();
	const { id } = useParams<{ id: string }>();
	const [isFilterOpen, setIsFilterOpen] = useState(false);
	const [surveyResponse, setSurveyResponse] =
		useState<SurveyResponseDetailType | null>(null);
	const [answerDetails, setAnswerDetails] =
		useState<SurveyAnswerDetailResult | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		partner.addAccessoryButton({
			id: "heart",
			title: "하트",
			icon: {
				name: "icon-heart-mono",
			},
		});

		const cleanup = tdsEvent.addEventListener("navigationAccessoryEvent", {
			onEvent: ({ id: buttonId }) => {
				if (buttonId === "heart") {
					navigate("/estimate");
				}
			},
		});

		return cleanup;
	}, [navigate]);

	// 설문 상세 조회
	useEffect(() => {
		const fetchSurveyDetail = async () => {
			if (!id) return;

			try {
				setIsLoading(true);
				console.log("설문 상세 조회 시작, surveyId:", id);

				// 각 API를 개별적으로 호출하여 에러 처리
				let result: SurveyAnswerDetailResult | null = null;
				let userSurveysResult = null;

				try {
					console.log("getSurveyAnswerDetail 호출 중...");
					result = await getSurveyAnswerDetail(Number(id));
					console.log("getSurveyAnswerDetail 성공:", result);
				} catch (error) {
					console.error("getSurveyAnswerDetail 실패:", error);
				}

				try {
					console.log("getUserSurveys 호출 중...");
					userSurveysResult = await getUserSurveys();
					console.log("getUserSurveys 성공:", userSurveysResult);
				} catch (error) {
					console.error("getUserSurveys 실패:", error);
				}

				if (!result) {
					console.error("설문 응답 상세 정보를 가져올 수 없습니다.");
					// getUserSurveys에서만 정보를 가져와서 기본 화면 표시
					if (userSurveysResult) {
						const survey = userSurveysResult.infoList.find(
							(s) => s.surveyId === Number(id),
						);
						setSurveyResponse({
							id: Number(id),
							title: survey?.title || "설문",
							status: "active",
							responseCount: survey?.currentCount || 0,
							questions: [],
						});
					} else {
						setSurveyResponse({
							id: Number(id),
							title: "설문",
							status: "active",
							responseCount: 0,
							questions: [],
						});
					}
					return;
				}

				setAnswerDetails(result);

				const survey = userSurveysResult?.infoList.find(
					(s) => s.surveyId === result!.surveyId,
				);
				const surveyTitle =
					survey?.title || result!.surveyId?.toString() || "설문";

				const status: "active" | "closed" =
					result!.status === "ONGOING" || result!.status === "ACTIVE"
						? "active"
						: "closed";

				const questions = (result!.detailInfoList || []).map((detail) => {
					const questionType = mapApiQuestionTypeToComponentType(detail.type);
					const responseCount = detail.answerList?.length || 0;

					return {
						id: String(detail.questionId),
						title: detail.title,
						type: questionType,
						required: detail.isRequired,
						responseCount,
					};
				});

				setSurveyResponse({
					id: result!.surveyId,
					title: surveyTitle,
					status,
					responseCount: result!.currentCount || 0,
					questions,
				});
			} catch (error) {
				console.error("설문 상세 조회 실패:", error);
				// 에러 발생 시에도 기본값 설정
				setSurveyResponse({
					id: Number(id),
					title: "설문",
					status: "active",
					responseCount: 0,
					questions: [],
				});
			} finally {
				setIsLoading(false);
			}
		};

		void fetchSurveyDetail();
	}, [id]);

	if (isLoading || !surveyResponse) {
		return (
			<div className="flex flex-col w-full h-screen bg-white items-center justify-center">
				<div>로딩 중...</div>
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
		navigate(path, {
			state: {
				question: {
					id: questionDetail.questionId,
					title: questionDetail.title,
					description: questionDetail.description,
					type,
					isRequired: questionDetail.isRequired,
					order: questionDetail.order,
				},
				answerMap: questionDetail.answerMap,
				answerList: questionDetail.answerList,
				surveyTitle: surveyResponse?.title || "",
				surveyStatus: surveyResponse?.status || "active",
				responseCount: questionDetail.answerList?.length || 0,
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
									top={`${parseInt(question.id, 10)}. ${question.title}`}
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
			/>
		</div>
	);
};
