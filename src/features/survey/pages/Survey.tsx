import type { InterestId } from "@shared/constants/topics";
import { formatRemainingTime } from "@shared/lib/FormatDate";
import type { ReturnTo } from "@shared/types/navigation";
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
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SurveyRewardInfoCard } from "../components/SurveyRewardInfoCard";
import { useSurveyAccessCheck } from "../hooks/useSurveyAccessCheck";
import { useSurveyDisplayInfo } from "../hooks/useSurveyDisplayInfo";
import { useSurveyInfo } from "../hooks/useSurveyInfo";
import { useSurveyQuestions } from "../hooks/useSurveyQuestions";
import { useSurveyRouteParams } from "../hooks/useSurveyRouteParams";

export const Survey = () => {
	const navigate = useNavigate();
	const { openToast } = useToast();

	const [error, setError] = useState<string | null>(null);
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

	const { surveyId, numericSurveyId, surveyFromState, locationState } =
		useSurveyRouteParams();

	// 설문 기본 정보 (제목, 설명, 마감일, 보상 여부, 스크리닝 필요 여부 등)
	const { data: surveyBasicInfoData, error: surveyBasicInfoError } =
		useSurveyInfo(numericSurveyId ?? undefined, {
			enabled: Boolean(numericSurveyId),
		});

	// 설문 문항 목록
	const { data: surveyQuestionsData, error: surveyQuestionsError } =
		useSurveyQuestions(numericSurveyId ?? undefined, {
			enabled: Boolean(numericSurveyId),
		});

	const surveyInfo = useMemo(() => {
		if (!surveyBasicInfoData) return null;
		const remainingTimeText = surveyBasicInfoData.deadline
			? formatRemainingTime(surveyBasicInfoData.deadline)
			: undefined;
		return {
			title: surveyBasicInfoData.title ?? "",
			description: surveyBasicInfoData.description ?? "",
			topicId: (surveyBasicInfoData.interests?.[0] ?? "CAREER") as InterestId,
			remainingTimeText,
			isClosed: remainingTimeText === "마감됨",
			isFree: surveyBasicInfoData.isFree ?? false,
			responseCount: surveyBasicInfoData.responseCount ?? 0,
		};
	}, [surveyBasicInfoData]);

	// 이전 페이지 데이터 + API 응답 병합하여 화면 표시용 값 반환 (이전 페이지 우선, 없으면 API)
	const {
		surveyTitle,
		surveyDescription,
		surveyTopicName,
		remainingTimeText,
		isClosed,
		isFree,
	} = useSurveyDisplayInfo({ surveyFromState, surveyInfo });

	const sortedQuestions = useMemo(() => {
		const info = surveyQuestionsData?.info ?? [];
		return [...info].sort(
			(a, b) => (a.questionOrder ?? 0) - (b.questionOrder ?? 0),
		);
	}, [surveyQuestionsData?.info]);

	const { getScreeningError, getAuthErrorFromException } = useSurveyAccessCheck(
		{
			surveyBasicInfoData: surveyBasicInfoData ?? null,
			surveyId,
			surveyFromState,
			locationState,
		},
	);

	useEffect(() => {
		if (!numericSurveyId) return;

		const screeningError = getScreeningError();
		if (screeningError) {
			setErrorDialog(screeningError);
			return;
		}
	}, [numericSurveyId, getScreeningError]);

	const apiError = surveyBasicInfoError ?? surveyQuestionsError;

	useEffect(() => {
		if (!apiError) {
			setError(null);
			return;
		}

		const handleError = async () => {
			const authError = await getAuthErrorFromException(apiError);
			if (authError) {
				setErrorDialog(authError);
			} else {
				setError("설문 정보를 불러오지 못했습니다.");
			}
		};
		void handleError();
	}, [apiError, getAuthErrorFromException]);

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
				surveyTitle: surveyTitle ?? "",
				surveyDescription: surveyDescription ?? "",
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
				<div className="flex-1 overflow-y-auto pb-[150px]">
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

					<SurveyRewardInfoCard
						isFree={isFree}
						questionCount={sortedQuestions.length}
						remainingTimeText={remainingTimeText}
					/>

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
							<div
								className="rounded-2xl px-4 py-5 flex items-center gap-3 min-h-[72px]"
								style={{ backgroundColor: "#FEF2F2" }}
							>
								<Asset.Icon
									frameShape={Asset.frameShape.CleanW24}
									backgroundColor="transparent"
									name="icon-error-circle-mono"
									color={colors.red500}
									aria-hidden={true}
									ratio="1/1"
								/>
								<Text color={colors.red600} typography="t6" fontWeight="medium">
									{error}
								</Text>
							</div>
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
