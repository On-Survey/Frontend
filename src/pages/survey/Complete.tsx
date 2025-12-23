import { adaptive, colors } from "@toss/tds-colors";
import { Asset, Button, ProgressBar, Text, Toast } from "@toss/tds-mobile";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSurvey } from "../../contexts/SurveyContext";
import { useModal } from "../../hooks/UseToggle";
import { useBackEventListener } from "../../hooks/useBackEventListener";
import { issuePromotion } from "../../service/promotion";
import { getMemberInfo } from "../../service/userInfo/api";

export const SurveyComplete = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const { isOpen: toastOpen, handleClose } = useModal(true);
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
		const fetchUserAndIssuePromotion = async () => {
			try {
				const memberInfo = await getMemberInfo();
				setUserName(memberInfo.name || "");
				const surveyId = state.surveyId || surveyIdFromState;
				if (surveyId) {
					try {
						await issuePromotion({ surveyId });
						console.log("토스포인트 지급 완료");
					} catch (error) {
						console.error("토스포인트 지급 실패:", error);
					}
				}
			} catch (error) {
				console.error("사용자 정보 조회 실패:", error);
			}
		};

		void fetchUserAndIssuePromotion();
	}, [state.surveyId, surveyIdFromState]);

	useBackEventListener(() => {
		navigate("/home", { replace: true });
		navigate("/surveyList", { replace: true });
	});

	return (
		<div className="flex min-h-screen w-full flex-col bg-white">
			<ProgressBar size="normal" color={colors.blue500} progress={1} />

			<div className="flex flex-1 flex-col items-center px-4">
				<Toast
					position="top"
					open={toastOpen}
					text="300원 받았어요."
					style={{ top: "350px" }}
					leftAddon={
						<div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-500 text-sm font-semibold text-white ">
							P
						</div>
					}
					duration={3000}
					onClose={handleClose}
				/>
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
					name="icon-check-circle-blue"
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
