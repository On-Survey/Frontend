import { adaptive, colors } from "@toss/tds-colors";
import {
	Asset,
	FixedBottomCTA,
	ProgressBar,
	Text,
	Toast,
} from "@toss/tds-mobile";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSurvey } from "../../contexts/SurveyContext";
import { useModal } from "../../hooks/UseToggle";
import { issuePromotion } from "../../service/promotion";
import { getMemberInfo } from "../../service/userInfo/api";

export const SurveyComplete = () => {
	const navigate = useNavigate();
	const { isOpen: toastOpen, handleClose } = useModal(true);
	const { state } = useSurvey();
	const [userName, setUserName] = useState<string>("");

	// 사용자 정보 가져오기 및 토스포인트 지급
	useEffect(() => {
		const fetchUserAndIssuePromotion = async () => {
			try {
				const memberInfo = await getMemberInfo();
				setUserName(memberInfo.name || "");
				if (state.surveyId) {
					try {
						await issuePromotion({ surveyId: state.surveyId });
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
	}, [state.surveyId]);

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

			<div className="px-4 pb-4">
				<div className="mb-4 flex items-center gap-2 rounded-[18px] bg-gray-100 px-4 py-3">
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
			</div>
			<FixedBottomCTA loading={false} onClick={() => navigate("/surveyList")}>
				다른 설문 참여하기
			</FixedBottomCTA>
		</div>
	);
};

export default SurveyComplete;
