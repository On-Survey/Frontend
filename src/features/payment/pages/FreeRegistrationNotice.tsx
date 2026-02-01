import { useCreateSurveyInterests } from "@features/create-survey/hooks/useQuestionMutations";
import { useCreateFreeForm } from "@features/create-survey/hooks/useSurveyMutation";
import { usePaymentEstimate } from "@shared/contexts/PaymentContext";
import { useSurvey } from "@shared/contexts/SurveyContext";
import { useBackEventListener } from "@shared/hooks/useBackEventListener";
import { useQueryClient } from "@tanstack/react-query";
import { adaptive } from "@toss/tds-colors";
import {
	Asset,
	BottomSheet,
	Button,
	FixedBottomCTA,
	Post,
	StepperRow,
	Top,
} from "@toss/tds-mobile";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

export const FreeRegistrationNotice = () => {
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const { state } = useSurvey();
	const { estimate } = usePaymentEstimate();
	const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const createFreeFormMutation = useCreateFreeForm();
	const createSurveyInterestsMutation = useCreateSurveyInterests();

	useBackEventListener(() => {
		navigate(-1);
	});

	const handleFreeRegistration = () => {
		setIsBottomSheetOpen(true);
	};

	const handleCloseBottomSheet = () => {
		setIsBottomSheetOpen(false);
	};

	// 무료 설문 등록 페이로드 (EstimatePage에서 선택한 마감일 사용)
	const freeFormPayload = useMemo(() => {
		if (!state.surveyId || !estimate.date) return null;

		return {
			surveyId: state.surveyId,
			deadline: estimate.date.toISOString(),
		};
	}, [state.surveyId, estimate.date]);

	const handleConfirm = async () => {
		if (!freeFormPayload || !state.surveyId) {
			console.error("설문 정보가 없습니다");
			return;
		}

		setIsLoading(true);
		setIsBottomSheetOpen(false);

		try {
			// 무료 폼 생성
			await createFreeFormMutation.mutateAsync(freeFormPayload);

			// 관심사가 설정되어 있으면 반영
			if (state.topics.length > 0) {
				const interests = state.topics.map((topic) => topic.value);
				await createSurveyInterestsMutation.mutateAsync({
					surveyId: state.surveyId,
					interests,
				});
			}

			// 설문 리스트 갱신
			queryClient.invalidateQueries({ queryKey: ["userSurveys"] });
			queryClient.invalidateQueries({ queryKey: ["memberInfo"] });
			navigate("/payment/loading", { state: { isFree: true } });
		} catch (error) {
			console.error("무료 설문 등록 실패:", error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<>
			<Top
				title={
					<Top.TitleParagraph size={22} color={adaptive.grey900}>
						이 혜택, 정말 포기하실 건가요?
					</Top.TitleParagraph>
				}
				subtitleBottom={
					<Top.SubtitleParagraph>
						유료 설문은 응답의 질과 활용도가 달라요.
					</Top.SubtitleParagraph>
				}
				upper={
					<Top.UpperAssetContent
						content={
							<Asset.Lottie
								frameShape={Asset.frameShape.CleanW60}
								src="https://static.toss.im/lotties-common/alarm-spot.json"
								loop={false}
								aria-hidden={true}
							/>
						}
					/>
				}
			/>
			<div className="px-4">
				<StepperRow
					left={
						<StepperRow.AssetFrame
							shape={Asset.frameShape.CleanW32}
							content={
								<Asset.ContentImage
									src="https://static.toss.im/2d-emojis/png/4x/u1F3AF.png"
									aria-hidden={true}
								/>
							}
						/>
					}
					center={
						<StepperRow.Texts
							type="A"
							title="세그먼트 설정"
							description="연령,성별,거주지,스크리닝 설정으로 원하는 타겟에게만 정확히 질문하세요."
						/>
					}
				/>
				<StepperRow
					left={
						<StepperRow.AssetFrame
							shape={Asset.frameShape.CleanW32}
							content={
								<Asset.ContentImage
									src="https://static.toss.im/2d-emojis/png/4x/u26A1.png"
									aria-hidden={true}
								/>
							}
						/>
					}
					center={
						<StepperRow.Texts
							type="A"
							title="높은 응답 완료율"
							description="100명 응답, 약 1시간 내 완료 강력한 리워드  온서베이 패널 조합으로 설문 응답 완료까지 책임지고 지원합니다."
						/>
					}
				/>
				<StepperRow
					left={
						<StepperRow.AssetFrame
							shape={Asset.frameShape.CleanW32}
							content={
								<Asset.ContentImage
									src="https://static.toss.im/2d-emojis/png/4x/u1F4CA.png"
									aria-hidden={true}
								/>
							}
						/>
					}
					center={
						<StepperRow.Texts
							type="A"
							title="연령대·성별·지역별 결과 비교"
							description="선택한 세그먼트를 조합해, 의미 있는 인사이트만 확인하세요."
						/>
					}
					hideLine={true}
				/>
			</div>
			<FixedBottomCTA
				loading={isLoading}
				onClick={handleFreeRegistration}
				disabled={isLoading || !state.surveyId}
				style={
					{ "--button-background-color": "#15c67f" } as React.CSSProperties
				}
			>
				무료로 등록하기
			</FixedBottomCTA>
			<BottomSheet
				header={
					<BottomSheet.Header>
						설문을 무료로 등록하면 이런 제약이 생겨요.{" "}
					</BottomSheet.Header>
				}
				open={isBottomSheetOpen}
				onClose={handleCloseBottomSheet}
				cta={
					<BottomSheet.DoubleCTA
						leftButton={
							<Button
								color="dark"
								variant="weak"
								onClick={handleCloseBottomSheet}
							>
								닫기
							</Button>
						}
						rightButton={<Button onClick={handleConfirm}>확인했어요</Button>}
					/>
				}
			>
				<Post.Ul>
					<Post.Li>
						타겟·스크리닝 설정 불가 : 연령·성별·거주지 설정 및 스크리닝 질문이
						응답에 반영되지 않아요.
					</Post.Li>
					<Post.Li>
						응답 수 제한 및 설문 완료 미보장 : 응답자는 최대 100명으로 제한되며,
						추가 수집이 불가능해요.온서베이는 무료 설문의 응답 완료를 보장하지
						않아요.
					</Post.Li>
					<Post.Li>
						리워드 및 분석 기능 미제공 : 응답자 리워드가 제공되지 않으며,
						세그먼트 분석 기능을 사용할 수 없어요.
					</Post.Li>
				</Post.Ul>
			</BottomSheet>
		</>
	);
};
