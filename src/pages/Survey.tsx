import { colors } from "@toss/tds-colors";
import { Asset, Border, FixedBottomCTA, Text, Top } from "@toss/tds-mobile";
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { topics } from "../constants/topics";
import type { TransformedSurveyQuestion } from "../service/surveyParticipation";
import { getSurveyParticipation } from "../service/surveyParticipation";
import type { SurveyListItem } from "../types/surveyList";
import { getQuestionTypeRoute } from "../utils/questionRoute";

export const Survey = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const [searchParams] = useSearchParams();
	const locationState = location.state as
		| {
				survey?: SurveyListItem;
				surveyId?: string;
		  }
		| undefined;
	const surveyFromState = locationState?.survey;
	const surveyIdFromState = locationState?.surveyId ?? surveyFromState?.id;
	const surveyIdFromQuery = searchParams.get("surveyId");
	const surveyId = surveyIdFromQuery ?? surveyIdFromState ?? null;

	const [questions, setQuestions] = useState<TransformedSurveyQuestion[]>([]);
	const [, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!surveyId) {
			return;
		}

		const numericSurveyId = Number(surveyId);
		if (Number.isNaN(numericSurveyId)) {
			setQuestions([]);
			return;
		}

		let isMounted = true;

		const fetchSurveyParticipation = async () => {
			try {
				setIsLoading(true);
				setError(null);
				const result = await getSurveyParticipation({
					surveyId: numericSurveyId,
				});
				if (!isMounted) {
					return;
				}
				setQuestions(result.info ?? []);
			} catch (err) {
				console.error("설문 조회 실패:", err);
				if (!isMounted) {
					return;
				}
				setError("설문 정보를 불러오지 못했습니다.");
			} finally {
				if (isMounted) {
					setIsLoading(false);
				}
			}
		};

		void fetchSurveyParticipation();

		return () => {
			isMounted = false;
		};
	}, [surveyId]);

	const sortedQuestions = useMemo(
		() =>
			[...questions].sort(
				(a, b) => (a.questionOrder ?? 0) - (b.questionOrder ?? 0),
			),
		[questions],
	);

	const questionCount = sortedQuestions.length;
	const estimatedTime = useMemo(() => {
		if (questionCount <= 10) {
			return 2;
		} else if (questionCount <= 20) {
			return 4;
		}
		return 4;
	}, [questionCount]);

	const surveyTitle = surveyFromState?.title ?? "설문 제목";
	const surveyDescription =
		surveyFromState?.description ??
		"설문 참여를 통해 다양한 의견을 들려주세요.";
	const surveyTopicName = surveyFromState?.topicId
		? topics.find((topic) => topic.id === surveyFromState.topicId)?.name
		: undefined;
	const remainingTimeText = surveyFromState?.remainingTimeText;
	const isClosed = surveyFromState?.isClosed || remainingTimeText === "마감됨";

	const handleStart = () => {
		if (sortedQuestions.length === 0 || isClosed) {
			return;
		}

		const firstQuestion = sortedQuestions[0];
		const questionTypeRoute = getQuestionTypeRoute(firstQuestion.type);

		navigate(questionTypeRoute, {
			state: {
				surveyId,
				questions: sortedQuestions,
				currentQuestionIndex: 0,
				answers: {},
			},
		});
	};

	return (
		<div className="flex flex-col w-full h-screen">
			<div className="flex-1 overflow-y-auto pb-0">
				<Top
					title={
						<Top.TitleParagraph size={22} color={colors.grey900}>
							{surveyTitle}
						</Top.TitleParagraph>
					}
					subtitleBottom={
						surveyTopicName ? (
							<Top.SubtitleBadges
								badges={[
									{
										text: `# ${surveyTopicName}`,
										color: "blue",
										variant: "weak",
									},
								]}
							/>
						) : (
							<Top.SubtitleBadges
								badges={[
									{
										text: `# 예시 주제`,
										color: "blue",
										variant: "weak",
									},
								]}
							/>
						)
					}
				/>

				<div className="px-4">
					<div className="w-full rounded-2xl border border-blue-500 p-5 shadow-sm">
						<Text color={colors.grey900} typography="t5" fontWeight="semibold">
							참여 보상 : 300원
						</Text>
						<div className="h-2" />
						<Text color={colors.grey900} typography="t5" fontWeight="semibold">
							소요 시간 : {estimatedTime}분
						</Text>
						{remainingTimeText ? (
							<>
								<div className="h-2" />
								<Text
									color={colors.grey700}
									typography="t7"
									fontWeight="regular"
								>
									{remainingTimeText}
								</Text>
							</>
						) : null}
					</div>
				</div>

				<div className="px-4">
					<div className="flex items-center gap-3 my-6">
						<Asset.Icon
							frameShape={Asset.frameShape.CleanW24}
							backgroundColor="transparent"
							name="icon-man"
							aria-hidden={true}
							ratio="1/1"
						/>
						<Text color={colors.grey900} typography="t5" fontWeight="semibold">
							300명이 이 설문에 참여했어요!
						</Text>
					</div>
				</div>

				<Border variant="height16" className="w-full" />

				<div className="px-4 mt-6">
					<Text
						display="block"
						color={colors.grey700}
						typography="t6"
						fontWeight="regular"
					>
						{surveyDescription}
					</Text>
					{error ? (
						<Text color={colors.red500} typography="t7" className="mt-4">
							{error}
						</Text>
					) : null}
				</div>
			</div>

			<div className="fixed left-0 right-0 bottom-[120px] z-10 px-4">
				<div className="rounded-2xl bg-gray-50 p-4 flex items-center gap-3">
					<Asset.Icon
						frameShape={Asset.frameShape.CleanW24}
						backgroundColor="transparent"
						name="icon-loudspeaker"
						aria-hidden={true}
						ratio="1/1"
					/>
					<Text color={colors.grey800} typography="t6" fontWeight="semibold">
						올바른 응답이 더 좋은 결과를 만들어요.
					</Text>
				</div>
			</div>

			<FixedBottomCTA
				loading={false}
				onClick={handleStart}
				disabled={isClosed || sortedQuestions.length === 0}
			>
				{isClosed ? "설문 마감" : "설문 참여하기"}
			</FixedBottomCTA>
		</div>
	);
};
