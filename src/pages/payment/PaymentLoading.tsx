import { graniteEvent, IAP } from "@apps-in-toss/web-framework";

import { adaptive } from "@toss/tds-colors";
import { Asset, Top } from "@toss/tds-mobile";
import { useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { useMultiStep } from "../../contexts/MultiStepContext";
import { usePaymentEstimate } from "../../contexts/PaymentContext";
import { useSurvey } from "../../contexts/SurveyContext";
import { createForm } from "../../service/form";
import { createPayment } from "../../service/payments";
import { calculatePriceBreakdown } from "../../utils/paymentCalculator";

export const PaymentLoading = () => {
	const { goNextPayment } = useMultiStep();
	const { state, resetForm } = useSurvey();
	const { selectedCoinAmount, estimate, resetEstimate } = usePaymentEstimate();
	const location = useLocation();

	const isChargeFlow = location.pathname === "/payment/charge";
	const priceBreakdown = useMemo(
		() => calculatePriceBreakdown(estimate),
		[estimate],
	);

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
							const response = await createPayment({
								orderId: orderId,
								price: Number(
									selectedCoinAmount.displayAmount.replace("원", ""),
								),
							});

							if (response.success && state.surveyId) {
								const formPayload = {
									surveyId: state.surveyId,
									deadline: estimate.date?.toISOString() ?? "",
									gender: estimate.gender,
									genderPrice: priceBreakdown.genderPrice,
									age: estimate.age,
									agePrice: priceBreakdown.agePrice,
									residence: estimate.location,
									residencePrice: priceBreakdown.residencePrice,
									dueCount: priceBreakdown.dueCount,
									dueCountPrice: priceBreakdown.dueCountPrice,
									totalCoin: priceBreakdown.totalPrice,
								};
								await createForm(formPayload);
							}
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
						resetForm();
						resetEstimate();
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
	}, [
		selectedCoinAmount,
		goNextPayment,
		estimate,
		state.surveyId,
		priceBreakdown,
		resetForm,
		resetEstimate,
	]);

	useEffect(() => {
		const unsubscription = graniteEvent.addEventListener("backEvent", {
			onEvent: () => {},
			onError: (error) => {
				alert(`에러가 발생했어요: ${error}`);
			},
		});

		return unsubscription;
	}, []);

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
