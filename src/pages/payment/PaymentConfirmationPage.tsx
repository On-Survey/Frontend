import { IAP } from "@apps-in-toss/web-framework";
import { adaptive } from "@toss/tds-colors";
import {
	Asset,
	BottomInfo,
	FixedBottomCTA,
	Paragraph,
	Post,
	Top,
} from "@toss/tds-mobile";
import { useCallback, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { useMultiStep } from "../../contexts/MultiStepContext";
import { usePaymentEstimate } from "../../contexts/PaymentContext";
import { queryClient } from "../../contexts/queryClient";
import { useSurvey } from "../../contexts/SurveyContext";
import { useBackEventListener } from "../../hooks/useBackEventListener";
import { createPayment } from "../../service/payments";
import { pushGtmEvent } from "../../utils/gtm";
import { calculatePriceBreakdown } from "../../utils/paymentCalculator";
import { useCreateForm } from "../QuestionForm/hooks/useSurveyMutation";

export const PaymentConfirmationPage = () => {
	const { selectedCoinAmount, estimate, resetEstimate } = usePaymentEstimate();
	const { state, resetForm } = useSurvey();
	const { setPaymentStep, goPrevPayment } = useMultiStep();
	const location = useLocation();

	const createFormMutation = useCreateForm();

	const locationState = location.state as
		| { source?: "main_cta" | "mysurvey_button" | "mysurvey_edit" }
		| undefined;

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
		setPaymentStep(3); // PaymentLoading으로 이동
	}, [resetForm, resetEstimate, setPaymentStep]);

	const handleNext = () => {
		if (!selectedCoinAmount?.sku) {
			console.error("상품 정보가 없습니다");
			return;
		}

		const source = locationState?.source ?? "main_cta";
		const entryType = state.screening.enabled
			? "screening_complete"
			: "screening_skip";

		pushGtmEvent({
			event: "coin_charge",
			pagePath: "/createForm",
			...(state.surveyId && { survey_id: String(state.surveyId) }),
			step: "confirm",
			source,
			entry_type: entryType,
		});

		IAP.createOneTimePurchaseOrder({
			options: {
				sku: selectedCoinAmount.sku,
				processProductGrant: async ({ orderId }) => {
					try {
						await createPayment({
							orderId,
							price: Number(selectedCoinAmount.displayAmount.replace("원", "")),
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

					const source = locationState?.source ?? "main_cta";
					const transactionId = orderId;
					const value = Number(
						selectedCoinAmount.displayAmount.replace("원", ""),
					);
					const price = priceBreakdown.totalPrice;
					const itemName = selectedCoinAmount.displayName;
					pushGtmEvent({
						event: "purchase",
						pagePath: "/createForm",
						...(state.surveyId && { survey_id: String(state.surveyId) }),
						transaction_id: String(transactionId),
						value: String(value),
						price: String(price),
						item_name: itemName,
						entry_type: "settlement" as const,
						source,
					});

					// 결제 성공 시 바로 폼 생성 시작
					if (formPayload) {
						createFormMutation.mutate(formPayload, {
							onSuccess: () => {
								queryClient.invalidateQueries({ queryKey: ["userSurveys"] });
								queryClient.invalidateQueries({ queryKey: ["memberInfo"] });
								handleSuccess();
							},
							onError: (error) => {
								console.error("폼 생성 실패:", error);
							},
						});
					}
				}
			},
			onError: (error) => {
				console.error("인앱결제에 실패했어요:", error);
			},
		});
	};

	useBackEventListener(goPrevPayment);

	return (
		<>
			<Top
				title={
					<Top.TitleParagraph size={22} color={adaptive.grey900}>
						{selectedCoinAmount?.displayAmount} 결제하고,
						<br />
						{selectedCoinAmount?.displayName}을 살까요?
					</Top.TitleParagraph>
				}
				upper={
					<Top.UpperAssetContent
						content={
							<Asset.Lottie
								frameShape={Asset.frameShape.CleanW60}
								src="https://static.toss.im/lotties-common/check-spot.json"
								loop={false}
								aria-hidden={true}
							/>
						}
					/>
				}
			/>
			<div className="h-25" />
			<BottomInfo>
				<Post.Paragraph paddingBottom={8} typography="t7">
					<Paragraph.Text>
						<b style={{}}>안내사항</b>
					</Paragraph.Text>
				</Post.Paragraph>

				<Post.Paragraph paddingBottom={8} typography="t7">
					<Paragraph.Text>
						토스는 해당 서비스 제휴사이며, 결제는 애플 앱스토어를 통해서
						진행돼요.
					</Paragraph.Text>
				</Post.Paragraph>

				<Post.Paragraph paddingBottom={8} typography="t7">
					<Paragraph.Text>
						환불 신청은 애플 앱스토어에서만 가능해요. 토스를 통한 환불 신청은
						불가해요.
					</Paragraph.Text>
				</Post.Paragraph>

				<Post.Paragraph paddingBottom={24} typography="t7">
					<Paragraph.Text></Paragraph.Text>
				</Post.Paragraph>
			</BottomInfo>

			<FixedBottomCTA
				loading={false}
				onClick={handleNext}
				style={
					{ "--button-background-color": "#15c67f" } as React.CSSProperties
				}
			>
				다음
			</FixedBottomCTA>
		</>
	);
};
