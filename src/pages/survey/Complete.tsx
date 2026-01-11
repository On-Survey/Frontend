import { adaptive, colors } from "@toss/tds-colors";
import { Asset, Button, ProgressBar, Text } from "@toss/tds-mobile";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { queryClient } from "../../contexts/queryClient";
import { useSurvey } from "../../contexts/SurveyContext";
import { useUserInfo } from "../../contexts/UserContext";
import { useBackEventListener } from "../../hooks/useBackEventListener";
import { issuePromotion } from "../../service/promotion";

export const SurveyComplete = () => {
	const { userInfo, isLoading: isUserInfoLoading } = useUserInfo();

	const navigate = useNavigate();
	const location = useLocation();
	const { state, setSurveyId } = useSurvey();
	const [userName, setUserName] = useState<string>("");

	// location state에서 surveyId 가져오기
	const surveyIdFromState = (location.state as { surveyId?: number })?.surveyId;

	// surveyId를 context에 설정
	useEffect(() => {
		if (surveyIdFromState && !state.surveyId) {
			setSurveyId(surveyIdFromState);
		}
	}, [surveyIdFromState, state.surveyId, setSurveyId]);

	// 사용자 정보 가져오기 및 토스포인트 지급
	useEffect(() => {
		if (isUserInfoLoading) return;
		if (!userInfo) return;

		const fetchUserAndIssuePromotion = async () => {
			try {
				setUserName(userInfo?.result.name);
				const surveyId = state.surveyId || surveyIdFromState;
				if (!surveyId) return;

				// 재시도 로직
				const MAX_RETRIES = 5;
				const RETRY_DELAY = 1000; // 1초

				for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
					try {
						await issuePromotion({ surveyId });
						queryClient.invalidateQueries({ queryKey: ["globalStats"] });
						queryClient.invalidateQueries({ queryKey: ["ongoingSurveys"] });
						queryClient.refetchQueries({ queryKey: ["recommendedSurveys"] });
						queryClient.refetchQueries({ queryKey: ["impendingSurveys"] });
						queryClient.refetchQueries({ queryKey: ["ongoingSurveysList"] });
						console.log(
							`토스포인트 지급 완료 (시도 ${attempt}/${MAX_RETRIES})`,
						);
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
					}
				}
			} catch (error) {
				console.error("사용자 정보 조회 실패:", error);
			}
		};

		void fetchUserAndIssuePromotion();
	}, [state.surveyId, surveyIdFromState, userInfo, isUserInfoLoading]);

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
					{userName || "회원"}님의 소중한 의견 감사합니다!
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
