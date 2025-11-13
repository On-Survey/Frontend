import { IAP } from "@apps-in-toss/web-framework";
import { adaptive } from "@toss/tds-colors";
import { Asset, Top } from "@toss/tds-mobile";
import { useEffect } from "react";
import { useMultiStep } from "../../contexts/MultiStepContext";
import { usePaymentEstimate } from "../../contexts/PaymentContext";

export const PaymentLoading = () => {
	const { goNextPayment } = useMultiStep();
	const { selectedCoinAmount } = usePaymentEstimate();

	useEffect(() => {
		const buyIapProduct = async () => {
			if (!selectedCoinAmount?.sku) {
				throw new Error("상품 정보가 없습니다");
			}
			IAP.createOneTimePurchaseOrder({
				options: {
					sku: selectedCoinAmount.sku,
					processProductGrant: () => true,
				},
				onEvent: () => {
					setTimeout(() => {
						goNextPayment();
					}, 3000);
				},
				onError: (error) => {
					console.error("인앱결제에 실패했어요:", error);
				},
			});
		};
		buyIapProduct();
	}, [selectedCoinAmount, goNextPayment]);

	return (
		<>
			<Top
				title={
					<Top.TitleParagraph size={22} color={adaptive.grey900}>
						보유 코인으로
						<br />
						설문을 등록하고 있어요
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
