import { graniteEvent } from "@apps-in-toss/web-framework";
import { adaptive } from "@toss/tds-colors";
import { Asset, FixedBottomCTA, Text } from "@toss/tds-mobile";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useMultiStep } from "../../contexts/MultiStepContext";

export const PaymentSuccessPage = () => {
	const { resetActiveStep } = useMultiStep();

	const navigate = useNavigate();
	const location = useLocation();
	const isChargeFlow = location.pathname === "/payment/charge";

	const handleNavigate = () => {
		const target = isChargeFlow ? "/mypage" : "/mysurvey";
		navigate(target);
		requestAnimationFrame(() => {
			resetActiveStep();
		});
	};

	useEffect(() => {
		const unsubscription = graniteEvent.addEventListener("backEvent", {
			onEvent: () => {
				if (isChargeFlow) {
					navigate("/mypage");
				} else {
					navigate("/mysurvey");
				}
			},
			onError: (error) => {
				alert(`에러가 발생했어요: ${error}`);
			},
		});

		return unsubscription;
	}, [navigate, isChargeFlow]);
	return (
		<>
			<div className="flex flex-col items-center justify-center gap-3 min-h-screen pb-32">
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
					{/* TODO: 검수는 최대 2일 정도 소요돼요
받은 응답은 내 설문 탭에서 확인할 수 있어요. */}
					{isChargeFlow ? "충전한 코인으로 설문을 등록할 수 있어요." : ""}
				</Text>
			</div>
			<FixedBottomCTA loading={false} onClick={handleNavigate}>
				확인했어요
			</FixedBottomCTA>
		</>
	);
};
