import { colors } from "@toss/tds-colors";
import {
	Asset,
	Border,
	ConfirmDialog,
	FixedBottomCTA,
	Text,
	Top,
	useToast,
} from "@toss/tds-mobile";
import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { type InterestId, topics } from "../constants/topics";
import { useSurveyInfo } from "../hooks/useSurveyInfo";
import { useSurveyQuestions } from "../hooks/useSurveyQuestions";
import type { TransformedSurveyQuestion } from "../service/surveyParticipation";
import type { ReturnTo } from "../types/navigation";
import type { SurveyListItem } from "../types/surveyList";
import { formatRemainingTime } from "../utils/FormatDate";
import { pushGtmEvent } from "../utils/gtm";
import { getRefreshToken } from "../utils/tokenManager";

export const Survey = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const [searchParams] = useSearchParams();
	const { openToast } = useToast();
	const locationState = location.state as
		| {
				survey?: SurveyListItem;
				surveyId?: string;
				source?: "main" | "quiz" | "after_complete";
				quiz_id?: number;
		  }
		| undefined;
	const surveyFromState = locationState?.survey;
	const surveyIdFromState = locationState?.surveyId ?? surveyFromState?.id;
	const surveyIdFromQuery = searchParams.get("surveyId");
	const surveyId = surveyIdFromQuery ?? surveyIdFromState ?? null;
	const numericSurveyId = useMemo(() => {
		if (!surveyId) return null;
		const parsed = Number(surveyId);
		return Number.isNaN(parsed) ? null : parsed;
	}, [surveyId]);

	const [questions, setQuestions] = useState<TransformedSurveyQuestion[]>([]);
	const [error, setError] = useState<string | null>(null);
	const [surveyInfo, setSurveyInfo] = useState<{
		title: string;
		description: string;
		topicId?: InterestId;
		remainingTimeText?: string;
		isClosed?: boolean;
		isFree?: boolean;
		responseCount?: number;
	} | null>(null);

	// 에러 다이얼로그 상태
	const [errorDialog, setErrorDialog] = useState<{
		open: boolean;
		title: string;
		description?: string;
		redirectTo?: string;
		returnTo?: ReturnTo;
	}>({
		open: false,
		title: "",
	});

	const hasSentStartEvent = useRef(false);

	useEffect(() => {
		if (!surveyId || hasSentStartEvent.current) return;

		hasSentStartEvent.current = true;
		const source = locationState?.source ?? "main";
		const quizId = locationState?.quiz_id;

		pushGtmEvent({
			event: "survey_start",
			pagePath: "/survey",
			survey_id: String(surveyId),
			source,
			progress_percent: "0",
			...(quizId && { quiz_id: String(quizId) }),
		});
	}, [surveyId, locationState?.source, locationState?.quiz_id]);

	const { data: surveyBasicInfoData } = useSurveyInfo(
		numericSurveyId ?? undefined,
		{ enabled: Boolean(numericSurveyId) },
	);

	const { data: surveyQuestionsData } = useSurveyQuestions(
		numericSurveyId ?? undefined,
		{ enabled: Boolean(numericSurveyId) },
	);

	useEffect(() => {
		if (!numericSurveyId) {
			return;
		}

		if (surveyBasicInfoData?.isScreenRequired) {
			setErrorDialog({
				open: true,
				title: "스크리닝이 필요합니다",
				description: "스크리닝을 완료한 후 참여할 수 있어요.",
				redirectTo: "/oxScreening",
			});
			return;
		}

		if (surveyBasicInfoData?.isScreened) {
			setErrorDialog({
				open: true,
				title: "스크리닝 조건이 맞지 않습니다",
				description:
					"설정하신 스크리닝 조건에 맞지 않아 설문에 참여할 수 없어요.",
				redirectTo: "/home",
			});
			return;
		}

		let isMounted = true;

		const fetchSurveyParticipation = async () => {
			try {
				setError(null);
				const result = {
					info: surveyQuestionsData?.info ?? [],
					title: surveyBasicInfoData?.title ?? "",
					description: surveyBasicInfoData?.description ?? "",
					interests: surveyBasicInfoData?.interests ?? [],
					deadline: surveyBasicInfoData?.deadline ?? "",
					isFree: surveyBasicInfoData?.isFree ?? false,
					responseCount: surveyBasicInfoData?.responseCount ?? 0,
				};
				if (!isMounted) {
					return;
				}
				setQuestions(result.info ?? []);

				// API 응답에서 설문 메타 정보 설정
				const remainingTimeText = result.deadline
					? formatRemainingTime(result.deadline)
					: undefined;
				const isClosed = remainingTimeText === "마감됨";

				setSurveyInfo({
					title: result.title,
					description: result.description,
					topicId: (result.interests?.[0] ?? "CAREER") as InterestId,
					remainingTimeText,
					isClosed,
					isFree: result.isFree,
					responseCount: result.responseCount,
				});
			} catch (err) {
				console.log("err", err);
				console.error("설문 조회 실패:", err);
				if (!isMounted) {
					return;
				}

				// HTTP 상태 코드별 분기 처리
				const error = err as {
					response?: { status: number };
					code?: string;
				};

				// CORS 에러나 네트워크 에러로 인해 response가 없을 수 있음
				// ERR_NETWORK이면서 토큰이 없는 경우는 인증 문제로 간주
				const isNetworkError = error.code === "ERR_NETWORK";
				const is401Error = error.response?.status === 401;

				if (is401Error || (isNetworkError && !(await getRefreshToken()))) {
					// 인증 실패 - 로그인 페이지로 이동
					setErrorDialog({
						open: true,
						title: "로그인이 필요합니다",
						description: "로그인 후 이용해주세요",
						redirectTo: "/",
						returnTo: surveyId
							? {
									path: "/survey",
									state: {
										surveyId,
										survey: surveyFromState,
										source: locationState?.source ?? "main",
										quiz_id: locationState?.quiz_id,
									},
								}
							: undefined,
					});
					return;
				}

				if (error.response) {
					const status = error.response.status;

					if (status === 403) {
						// 권한 없음 - 메인 페이지로 이동
						setErrorDialog({
							open: true,
							title: "권한이 없는 설문입니다",
							description: "해당 설문에 참여할 권한이 없습니다",
							redirectTo: "/survey/ineligible",
						});
						return;
					}
				}

				// 기타 에러
				setError("설문 정보를 불러오지 못했습니다.");
			}
		};

		void fetchSurveyParticipation();

		return () => {
			isMounted = false;
		};
	}, [
		numericSurveyId,
		surveyBasicInfoData,
		surveyId,
		surveyFromState,
		locationState?.source,
		locationState?.quiz_id,
		surveyQuestionsData?.info,
	]);
	surveyQuestionsData?.info;

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

	const currentSurvey =
		surveyFromState ??
		(surveyInfo
			? {
					id: surveyId ?? "",
					topicId: surveyInfo.topicId ?? "CAREER",
					title: surveyInfo.title,
					iconType: "icon" as const,
					description: surveyInfo.description,
					remainingTimeText: surveyInfo.remainingTimeText,
					isClosed: surveyInfo.isClosed,
					isFree: surveyInfo.isFree,
				}
			: null);

	const surveyTitle = currentSurvey?.title;
	const surveyDescription = currentSurvey?.description;
	const surveyTopicName = currentSurvey?.topicId
		? topics.find((topic) => topic.id === currentSurvey.topicId)?.name
		: undefined;
	const remainingTimeText = currentSurvey?.remainingTimeText;
	const isClosed = currentSurvey?.isClosed || remainingTimeText === "마감됨";

	const handleStart = () => {
		if (sortedQuestions.length === 0 || isClosed) {
			return;
		}

		if (surveyBasicInfoData?.isSurveyResponded) {
			openToast("이미 참여한 설문입니다.", {
				type: "bottom",
				lottie: "https://static.toss.im/lotties-common/error-yellow-spot.json",
				higherThanCTA: true,
			});
			return;
		}

		const source = locationState?.source ?? "main";
		// 섹션 기반 설문 페이지로 이동 (section=1로 시작)
		navigate("/survey/section", {
			state: {
				surveyId: numericSurveyId,
				currentSection: 1,
				answers: {},
				previousAnswers: {},
				surveyTitle: surveyInfo?.title ?? currentSurvey?.title ?? "",
				surveyDescription:
					surveyInfo?.description ?? currentSurvey?.description ?? "",
				source,
			},
		});
	};

	const handleErrorDialogConfirm = () => {
		setErrorDialog({ open: false, title: "" });
		if (errorDialog.redirectTo) {
			navigate(errorDialog.redirectTo, {
				replace: true,
				state: errorDialog.returnTo
					? { returnTo: errorDialog.returnTo }
					: undefined,
			});
		}
	};

	return (
		<>
			<ConfirmDialog
				open={errorDialog.open}
				onClose={handleErrorDialogConfirm}
				title={errorDialog.title}
				description={errorDialog.description}
				confirmButton={
					<ConfirmDialog.ConfirmButton
						size="xlarge"
						onClick={handleErrorDialogConfirm}
						style={
							{ "--button-background-color": "#15c67f" } as React.CSSProperties
						}
					>
						확인
					</ConfirmDialog.ConfirmButton>
				}
			/>
			<div className="flex flex-col w-full h-screen">
				<div className="flex-1 overflow-y-auto pb-0">
					<Top
						title={
							surveyTitle ? (
								<Top.TitleParagraph size={22} color={colors.grey900}>
									{surveyTitle}
								</Top.TitleParagraph>
							) : undefined
						}
						subtitleBottom={
							surveyTopicName ? (
								<Top.SubtitleBadges
									badges={[
										{
											text: `# ${surveyTopicName}`,
											color: "green",
											variant: "weak",
										},
									]}
								/>
							) : undefined
						}
					/>

					<div className="px-4">
						<div className="w-full rounded-2xl border border-green-500 p-5 shadow-sm">
							<Text
								color={colors.grey900}
								typography="t5"
								fontWeight="semibold"
							>
								{surveyFromState?.isFree === true || surveyInfo?.isFree === true
									? "참여보상이 없는 설문이에요"
									: "참여 보상 : 200원"}
							</Text>
							<div className="h-2" />
							<Text
								color={colors.grey900}
								typography="t5"
								fontWeight="semibold"
							>
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
							<Asset.Image
								frameShape={Asset.frameShape.CleanW24}
								backgroundColor="transparent"
								src="https://static.toss.im/2d-emojis/png/4x/u1F469_u1F3FB_u200D_u1F4BB.png"
								aria-hidden={true}
								style={{ aspectRatio: `1/1` }}
							/>
							<Text
								color={colors.grey900}
								typography="t5"
								fontWeight="semibold"
							>
								{surveyInfo?.responseCount
									? `${surveyInfo.responseCount.toLocaleString()}명이 이 설문에 참여했어요!`
									: "이 설문에 참여해보세요!"}
							</Text>
						</div>
					</div>

					<Border variant="height16" className="w-full" />

					{surveyDescription && (
						<div className="px-4 mt-6">
							<Text
								display="block"
								color={colors.grey700}
								typography="t6"
								fontWeight="regular"
							>
								{surveyDescription}
							</Text>
						</div>
					)}
					{error && (
						<div className="px-4 mt-6">
							<Text color={colors.red500} typography="t7">
								{error}
							</Text>
						</div>
					)}
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
					style={
						{ "--button-background-color": "#15c67f" } as React.CSSProperties
					}
				>
					{isClosed ? "설문 마감" : "설문 참여하기"}
				</FixedBottomCTA>
			</div>
		</>
	);
};
