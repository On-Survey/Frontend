import { IAP } from "@apps-in-toss/web-framework";
import { adaptive } from "@toss/tds-colors";
import { Asset, Top } from "@toss/tds-mobile";
import { useEffect } from "react";
import { useMultiStep } from "../../contexts/MultiStepContext";
import { usePaymentEstimate } from "../../contexts/PaymentContext";
import { createPayment } from "../../service/payments";

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
					processProductGrant: async ({ orderId }) => {
						try {
							await createPayment({
								orderId: orderId,
								price: Number(
									selectedCoinAmount.displayAmount.replace("원", ""),
								),
							});
							return true;
						} catch (error) {
							console.error("결제 정보 전송 실패:", error);
							return false;
						}
					},
				},
				onEvent: async (event) => {
					if (event.type === "success") {
						const { orderId } = event.data;
						console.log("인앱결제에 성공했어요. 주문 번호:", orderId);
						setTimeout(() => {
							goNextPayment();
						}, 3000);
					}
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
