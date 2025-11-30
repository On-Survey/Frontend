import { adaptive } from "@toss/tds-colors";
import { Asset, FixedBottomCTA, Text } from "@toss/tds-mobile";
import { useLocation, useNavigate } from "react-router-dom";
import { useMultiStep } from "../../contexts/MultiStepContext";
import { useBackEventListener } from "../../hooks/useBackEventListener";

export const PaymentSuccessPage = () => {
	const { resetScreening, resetSurvey, resetPayment } = useMultiStep();

	const navigate = useNavigate();
	const location = useLocation();
	const isChargeFlow = location.pathname === "/payment/charge";

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
				<Asset.Image
					frameShape={{ width: 100 }}
					src="https://static.toss.im/lotties/check-spot-apng.png"
					aria-hidden={true}
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
			<FixedBottomCTA loading={false} onClick={handleNavigate}>
				확인했어요
			</FixedBottomCTA>
		</div>
	);
};
