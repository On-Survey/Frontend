import { adaptive } from "@toss/tds-colors";
import { Asset, FixedBottomCTA, Text } from "@toss/tds-mobile";
import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useMultiStep } from "../../contexts/MultiStepContext";
import { usePaymentEstimate } from "../../contexts/PaymentContext";
import { useSurvey } from "../../contexts/SurveyContext";
import { useUserInfo } from "../../contexts/UserContext";
import { useBackEventListener } from "../../hooks/useBackEventListener";
import { pushGtmEvent } from "../../utils/gtm";

export const PaymentSuccessPage = () => {
	const { resetScreening, resetSurvey, resetPayment } = useMultiStep();
	const { state } = useSurvey();
	const { totalPrice } = usePaymentEstimate();
	const { userInfo } = useUserInfo();
	const hasSentEvent = useRef(false);

	const navigate = useNavigate();
	const location = useLocation();
	const isChargeFlow = location.pathname === "/payment/charge";

	const locationState = location.state as
		| { source?: "main_cta" | "mysurvey_button" | "mysurvey_edit" }
		| undefined;

	useEffect(() => {
		if (hasSentEvent.current || isChargeFlow) return;

		hasSentEvent.current = true;
		const source = locationState?.source ?? "main_cta";
		const entryType = state.screening?.enabled
			? "screening_complete"
			: "screening_skip";
		const usedCoin = totalPrice;
		const remainingCoin = userInfo?.result.coin ?? 0;

		pushGtmEvent({
			event: "survey_register_success",
			pagePath: "/createForm",
			...(state.surveyId && { survey_id: String(state.surveyId) }),
			step: "complete",
			used_coin: String(usedCoin),
			remaining_coin: String(remainingCoin),
			source,
			entry_type: entryType,
		});

		// 구매 전환 시 사용자 속성 로깅
		const logUserProperties = async () => {
			try {
				pushGtmEvent({
					event: "user_info",
					login_method: "",
					user_region: userInfo?.result.residence ?? "",
					user_age: userInfo?.result.age ?? "",
					user_gender: userInfo?.result.gender ?? "",
				});
			} catch (error) {
				console.error("구매 시 사용자 속성 로깅 실패:", error);
			}
		};

		void logUserProperties();
	}, [
		isChargeFlow,
		locationState?.source,
		state.surveyId,
		state.screening?.enabled,
		totalPrice,
		userInfo?.result.coin,
		userInfo?.result.residence,
		userInfo?.result.age,
		userInfo?.result.gender,
	]);

	const handleNavigate = () => {
		const target = isChargeFlow ? "/mypage" : "/mysurvey";
		navigate(target);
		requestAnimationFrame(() => {
			resetSurvey();
			resetScreening();
			resetPayment();
		});
	};

	useBackEventListener(() => {
		if (isChargeFlow) {
			navigate("/mypage");
		} else {
			navigate("/mysurvey");
		}
	});

	return (
		<div className="flex flex-col h-screen">
			<div className="flex-1 flex flex-col items-center justify-center gap-3">
				<Asset.Icon
					frameShape={Asset.frameShape.CleanW100}
					name="icon-check-circle-green"
					aria-hidden={true}
					ratio="1/1"
				/>
				<div className="h-3" />
				<Text color={adaptive.grey800} typography="t2" fontWeight="bold">
					{isChargeFlow ? "코인이 충전됐어요" : "설문이 잘 등록됐어요"}
				</Text>
				<Text
					display="block"
					color={adaptive.grey700}
					typography="t5"
					fontWeight="regular"
					textAlign="center"
				>
					{/* TODO: 검수는 최대 2일 정도 소요돼요, 받은 응답은 내 설문 탭에서 확인할 수 있어요. 라는 키워드는 검수 과정이 생기면 다시 추가 */}
					{isChargeFlow ? "충전한 코인으로 설문을 등록할 수 있어요." : ""}
				</Text>
			</div>
			<FixedBottomCTA
				loading={false}
				onClick={handleNavigate}
				style={
					{ "--button-background-color": "#15c67f" } as React.CSSProperties
				}
			>
				확인했어요
			</FixedBottomCTA>
		</div>
	);
};
