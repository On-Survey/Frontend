import { adaptive } from "@toss/tds-colors";
import { Asset, Top } from "@toss/tds-mobile";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useMultiStep } from "../../contexts/MultiStepContext";
import { useBackEventListener } from "../../hooks/useBackEventListener";

export const PaymentLoading = () => {
	const location = useLocation();
	const isChargeFlow = location.pathname === "/payment/charge";
	const { goNextPayment } = useMultiStep();

	useEffect(() => {
		setTimeout(() => {
			goNextPayment();
		}, 3000);
	}, [goNextPayment]);

	useBackEventListener(() => {});

	return (
		<>
			<Top
				title={
					<Top.TitleParagraph size={22} color={adaptive.grey900}>
						{isChargeFlow
							? "코인을 충전하고 있어요"
							: "보유 코인으로\n설문을 등록하고 있어요"}
					</Top.TitleParagraph>
				}
				subtitleBottom={
					<Top.SubtitleParagraph color={adaptive.grey500}>
						잠시만 기다려주세요.
					</Top.SubtitleParagraph>
				}
			/>

			<Asset.Lottie
				frameShape={{ width: 375 }}
				src="https://static.toss.im/lotties/loading/load-ripple.json"
				loop={true}
				speed={1}
				aria-hidden={true}
			/>
		</>
	);
};
