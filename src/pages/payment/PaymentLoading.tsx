import { graniteEvent, IAP } from "@apps-in-toss/web-framework";

import { adaptive } from "@toss/tds-colors";
import { Asset, Top } from "@toss/tds-mobile";
import { useCallback, useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { useMultiStep } from "../../contexts/MultiStepContext";
import { usePaymentEstimate } from "../../contexts/PaymentContext";
import { useSurvey } from "../../contexts/SurveyContext";
import { useUserInfo } from "../../contexts/UserContext";
import { createForm } from "../../service/form";
import { createPayment } from "../../service/payments";
import { calculatePriceBreakdown } from "../../utils/paymentCalculator";

export const PaymentLoading = () => {
	const { goNextPayment } = useMultiStep();
	const { state, resetForm } = useSurvey();
	const { selectedCoinAmount, estimate, resetEstimate } = usePaymentEstimate();
	const { userInfo } = useUserInfo();

	const location = useLocation();

	const isChargeFlow = location.pathname === "/payment/charge";
	const priceBreakdown = useMemo(
		() => calculatePriceBreakdown(estimate),
		[estimate],
	);

	const formPayload = useMemo(() => {
		if (!state.surveyId) return null;
		return {
			surveyId: state.surveyId,
			deadline: estimate.date?.toISOString() ?? "",
			gender: estimate.gender,
			genderPrice: priceBreakdown.genderPrice,
			ages: estimate.ages,
			agePrice: priceBreakdown.agePrice,
			residence: estimate.location,
			residencePrice: priceBreakdown.residencePrice,
			dueCount: priceBreakdown.dueCount,
			dueCountPrice: priceBreakdown.dueCountPrice,
			totalCoin: priceBreakdown.totalPrice,
		};
	}, [
		state.surveyId,
		estimate.date,
		estimate.gender,
		estimate.ages,
		estimate.location,
		priceBreakdown,
	]);

	const handleSuccess = useCallback(() => {
		resetForm();
		resetEstimate();
		setTimeout(() => {
			goNextPayment();
		}, 3000);
	}, [resetForm, resetEstimate, goNextPayment]);

	const submitForm = useCallback(async () => {
		if (!formPayload) return;
		try {
			await createForm(formPayload);
		} catch (error) {
			console.error("폼 생성 실패:", error);
			throw error;
		}
	}, [formPayload]);

	useEffect(() => {
		if (!userInfo) return;

		const hasEnoughCoin = userInfo.result.coin >= priceBreakdown.totalPrice;

		if (hasEnoughCoin) {
			const processWithCoin = async () => {
				try {
					await submitForm();
					handleSuccess();
				} catch (error) {
					console.error("코인으로 결제 처리 실패:", error);
				}
			};
			processWithCoin();
			return;
		}

		const buyIapProduct = async () => {
			if (!selectedCoinAmount?.sku) {
				console.error("상품 정보가 없습니다");
				return;
			}

			IAP.createOneTimePurchaseOrder({
				options: {
					sku: selectedCoinAmount.sku,
					processProductGrant: async ({ orderId }) => {
						try {
							const response = await createPayment({
								orderId,
								price: Number(
									selectedCoinAmount.displayAmount.replace("원", ""),
								),
							});

							if (response.success && formPayload) {
								await submitForm();
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
						handleSuccess();
					}
				},
				onError: (error) => {
					console.error("인앱결제에 실패했어요:", error);
				},
			});
		};

		buyIapProduct();
	}, [
		userInfo,
		priceBreakdown.totalPrice,
		selectedCoinAmount,
		formPayload,
		handleSuccess,
		submitForm,
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
