import { adaptive } from "@toss/tds-colors";
import { Asset, Top } from "@toss/tds-mobile";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useMultiStep } from "../../contexts/MultiStepContext";
import { useBackEventListener } from "../../hooks/useBackEventListener";

export const PaymentLoading = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const isChargeFlow = location.pathname === "/payment/charge";
	const locationState = location.state as { isFree?: boolean } | undefined;
	const isFree = locationState?.isFree ?? false;
	const { goNextPayment } = useMultiStep();

	useEffect(() => {
		setTimeout(() => {
			if (isFree) {
				// 무료 설문인 경우 성공 페이지로 직접 이동
				navigate("/payment/success");
			} else {
				// 유료 설문인 경우 기존 플로우 유지
				goNextPayment();
			}
		}, 3000);
	}, [goNextPayment, isFree, navigate]);

	useBackEventListener(() => {});

	return (
		<>
			<Top
				title={
					<Top.TitleParagraph size={22} color={adaptive.grey900}>
						{isChargeFlow
							? "코인을 충전하고 있어요"
							: isFree
								? "소중한 설문을 잘 등록하고 있어요"
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
