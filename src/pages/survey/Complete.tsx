import { adaptive, colors } from "@toss/tds-colors";
import { Asset, Button, ProgressBar, Text } from "@toss/tds-mobile";
import { useCallback, useEffect, useRef, useState } from "react";

import { useLocation, useNavigate } from "react-router-dom";
import { queryClient } from "../../contexts/queryClient";
import { useSurvey } from "../../contexts/SurveyContext";
import { useUserInfo } from "../../contexts/UserContext";
import { useBackEventListener } from "../../hooks/useBackEventListener";
import { issuePromotion } from "../../service/promotion";
import { getSurveyInfo } from "../../service/surveyParticipation";
import { pushGtmEvent } from "../../utils/gtm";

export const SurveyComplete = () => {
	const {
		userInfo,
		isLoading: isUserInfoLoading,
		fetchUserInfo,
	} = useUserInfo();

	const navigate = useNavigate();
	const location = useLocation();
	const { state, setSurveyId } = useSurvey();

	const locationState = location.state as
		| {
				surveyId?: number;
				isFree?: boolean;
				source?: "main" | "quiz" | "after_complete";
				promotionIssued?: boolean;
		  }
		| undefined;
	const surveyIdFromState = locationState?.surveyId;
	const isFreeFromState = locationState?.isFree;
	const promotionIssuedFromState = locationState?.promotionIssued;

	const [isFree, setIsFree] = useState<boolean | undefined>(isFreeFromState);

	useEffect(() => {
		if (surveyIdFromState && !state.surveyId) {
			setSurveyId(surveyIdFromState);
		}
	}, [surveyIdFromState, state.surveyId, setSurveyId]);

	const hasSentCompleteEvent = useRef(false);
	const hasIssuedPromotion = useRef(false);

	// 설문 완료 GTM 이벤트 전송
	useEffect(() => {
		const surveyId = state.surveyId || surveyIdFromState;
		if (!surveyId || hasSentCompleteEvent.current) return;

		hasSentCompleteEvent.current = true;
		const source = locationState?.source ?? "main";

		pushGtmEvent({
			event: "survey_complete",
			pagePath: "/survey/complete",
			survey_id: String(surveyId),
			source,
			reward_amount: "200",
		});
	}, [state.surveyId, surveyIdFromState, locationState?.source]);

	const checkIfSurveyIsFree = useCallback(
		async (surveyId: number): Promise<boolean> => {
			if (isFreeFromState !== undefined) {
				setIsFree(isFreeFromState);
				return isFreeFromState === true;
			}

			try {
				const surveyInfo = await getSurveyInfo(surveyId);
				const isSurveyFree = surveyInfo.isFree === true;
				setIsFree(isSurveyFree);
				return isSurveyFree;
			} catch (error) {
				console.error("설문 정보 조회 실패:", error);
				setIsFree(false);
				throw error;
			}
		},
		[isFreeFromState],
	);

	const issuePromotionWithRetry = useCallback(
		async (surveyId: number): Promise<void> => {
			const MAX_RETRIES = 5;
			const RETRY_DELAY = 1000;

			for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
				try {
					await issuePromotion({ surveyId });
					queryClient.invalidateQueries({ queryKey: ["globalStats"] });
					queryClient.invalidateQueries({ queryKey: ["ongoingSurveys"] });
					queryClient.refetchQueries({ queryKey: ["recommendedSurveys"] });
					queryClient.refetchQueries({ queryKey: ["impendingSurveys"] });
					queryClient.refetchQueries({ queryKey: ["ongoingSurveysList"] });
					console.log(`토스포인트 지급 완료 (시도 ${attempt}/${MAX_RETRIES})`);
					return;
				} catch (error) {
					console.error(
						`토스포인트 지급 실패 (시도 ${attempt}/${MAX_RETRIES}):`,
						error,
					);

					if (attempt < MAX_RETRIES) {
						await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
						continue;
					}

					console.error("토스포인트 지급 모든 재시도 실패");
					throw error;
				}
			}
		},
		[],
	);

	// 토스포인트 지급 재시도 처리 (제출 버튼에서 실패한 경우)
	useEffect(() => {
		// 이미 처리했거나 조건이 맞지 않으면 종료
		if (hasIssuedPromotion.current) return;

		// 제출 버튼에서 이미 성공한 경우 재시도 불필요
		if (promotionIssuedFromState === true) {
			hasIssuedPromotion.current = true;
			return;
		}

		const handlePromotionRetry = async () => {
			if (hasIssuedPromotion.current) return;

			try {
				const surveyId = state.surveyId || surveyIdFromState;
				if (!surveyId) return;

				const isSurveyFree = await checkIfSurveyIsFree(surveyId);
				if (isSurveyFree) {
					console.log("무료 설문이므로 프로모션 지급을 건너뜁니다.");
					hasIssuedPromotion.current = true;
					return;
				}

				if (!userInfo && !isUserInfoLoading) {
					console.log("userInfo가 없어 재호출합니다.");
					try {
						await fetchUserInfo();
					} catch (error) {
						console.error("userInfo 재호출 실패:", error);
					}
				}

				console.log(
					"제출 버튼에서 프로모션 지급 실패, Complete 페이지에서 재시도",
				);
				await issuePromotionWithRetry(surveyId);
				hasIssuedPromotion.current = true;
			} catch (error) {
				console.error("프로모션 지급 재시도 실패:", error);
				hasIssuedPromotion.current = true;
			}
		};

		if (
			!isUserInfoLoading &&
			(promotionIssuedFromState === false ||
				promotionIssuedFromState === undefined)
		) {
			void handlePromotionRetry();
		}
	}, [
		state.surveyId,
		surveyIdFromState,
		userInfo,
		isUserInfoLoading,
		fetchUserInfo,
		promotionIssuedFromState,
		checkIfSurveyIsFree,
		issuePromotionWithRetry,
	]);

	useBackEventListener(() => {
		navigate("/home", { replace: true });
		navigate("/surveyList", { replace: true });
	});

	return (
		<div className="flex min-h-screen w-full flex-col bg-white">
			<ProgressBar size="normal" color={colors.green500} progress={1} />

			<div className="flex flex-1 flex-col items-center px-4">
				<div className="h-[168px]" />
				<Text
					display="block"
					color={adaptive.grey800}
					typography="t3"
					fontWeight="bold"
					textAlign="center"
				>
					{userInfo?.result?.name || "회원"}님의 소중한 의견 감사합니다!
				</Text>
				<div className="h-6" />
				<Asset.Icon
					frameShape={Asset.frameShape.CleanW100}
					backgroundColor="transparent"
					name="icon-check-circle-green"
					ratio="1/1"
					aria-hidden={true}
				/>

				<div className="mt-10" />
			</div>

			<div className="fixed bottom-6 left-0 right-0 flex flex-col gap-2 px-4 pb-4 bg-white">
				{isFree !== true && (
					<div className="mb-6 flex items-center gap-2 rounded-[18px] bg-gray-100 px-4 py-3">
						<Asset.Icon
							frameShape={Asset.frameShape.CleanW24}
							backgroundColor="transparent"
							name="icon-loudspeaker"
							ratio="1/1"
							aria-hidden={true}
						/>
						<Text color={adaptive.grey900} typography="t6">
							리워드 지급이 지연될 수 있어요
						</Text>
					</div>
				)}
				<Button
					color="primary"
					display="block"
					onClick={() => navigate("/surveyList")}
					style={
						{ "--button-background-color": "#15c67f" } as React.CSSProperties
					}
				>
					다른 설문 참여하기
				</Button>
				<Button
					color="dark"
					variant="weak"
					display="block"
					onClick={() => navigate("/home")}
				>
					홈으로 가기
				</Button>
			</div>
		</div>
	);
};

export default SurveyComplete;
