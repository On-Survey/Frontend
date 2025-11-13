import { graniteEvent } from "@apps-in-toss/web-framework";
import { adaptive } from "@toss/tds-colors";
import { Asset, FixedBottomCTA, Text } from "@toss/tds-mobile";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const PaymentSuccessPage = () => {
	const navigate = useNavigate();

	//TODO: 실제 네비게이션 로직으로 변경
	const handleNavigate = () => {
		navigate("/mysurvey");
	};

	useEffect(() => {
		const unsubscription = graniteEvent.addEventListener("backEvent", {
			onEvent: () => {
				navigate("/mysurvey");
			},
			onError: (error) => {
				alert(`에러가 발생했어요: ${error}`);
			},
		});

		return unsubscription;
	}, [navigate]);
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
					설문이 잘 등록됐어요
				</Text>
				<Text
					display="block"
					color={adaptive.grey700}
					typography="t5"
					fontWeight="regular"
					textAlign="center"
				>
					검수는 최대 2일 정도 소요돼요
					<br />
					받은 응답은 내 설문 탭에서 확인할 수 있어요.
				</Text>
			</div>
			<FixedBottomCTA loading={false} onClick={handleNavigate}>
				확인했어요
			</FixedBottomCTA>
		</>
	);
};
