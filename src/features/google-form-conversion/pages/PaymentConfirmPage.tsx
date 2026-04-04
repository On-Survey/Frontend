import { IAP } from "@apps-in-toss/web-framework";
import type { Interest } from "@features/create-survey/service/form/types";
import { useOptionsFormContext } from "@features/google-form-conversion/context/OptionsFormContext";
import { useRequestFormContext } from "@features/google-form-conversion/context/RequestEntryContext";
import type {
	AgeCode,
	GenderCode,
	RegionCode,
} from "@features/payment/constants/payment";
import { createGoogleFormPayment } from "@features/payment/service/payments";
import { topics } from "@shared/constants/topics";
import { pushGtmEvent } from "@shared/lib/gtm";
import { adaptive } from "@toss/tds-colors";
import {
	Asset,
	BottomInfo,
	FixedBottomCTA,
	Paragraph,
	Post,
	Top,
} from "@toss/tds-mobile";
import { useNavigate } from "react-router-dom";
import { createRequest } from "../service/api";
import {
	buildCreateRequestBody,
	formatDateToISO,
	getDefaultDeadline,
} from "../utils";

const formatPrice = (price: number) =>
	price.toLocaleString("ko-KR", { maximumFractionDigits: 0 });

export const PaymentConfirmPage = () => {
	const navigate = useNavigate();
	const {
		selectedProduct,
		respondentCount,
		gender,
		ages,
		residence,
		interestIds,
		screening,
		promotionCode,
		verifiedPromotionCode,
		deadlineIsoDate,
	} = useOptionsFormContext();
	const { formLink, email } = useRequestFormContext();
	const deadline =
		deadlineIsoDate && /^\d{4}-\d{2}-\d{2}$/.test(deadlineIsoDate)
			? deadlineIsoDate
			: formatDateToISO(getDefaultDeadline());
	const price = selectedProduct
		? Number(selectedProduct.displayAmount.replace(/[^\d]/g, ""))
		: 0;
	const discountCode =
		verifiedPromotionCode !== null &&
		verifiedPromotionCode === (promotionCode ?? "").trim()
			? verifiedPromotionCode
			: undefined;
	const interests: Interest[] = interestIds
		.map((id) => topics.find((t) => t.id === id)?.value)
		.filter((v): v is Interest => v != null);

	const handlePayment = () => {
		pushGtmEvent({
			event: "form_coin_charge",
			pagePath: "/payment/google-form-conversion-payment-confirm",
		});
		if (!selectedProduct?.sku) {
			console.error("상품 정보가 없습니다");
			return;
		}
		if (price <= 0) {
			console.error("결제 금액 정보가 없습니다");
			return;
		}

		IAP.createOneTimePurchaseOrder({
			options: {
				sku: selectedProduct.sku,
				processProductGrant: async ({ orderId }) => {
					try {
						await createGoogleFormPayment({
							orderId,
							price,
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

					pushGtmEvent({
						event: "purchase",
						pagePath: "/payment/google-form-conversion-payment-confirm",
						transaction_id: String(orderId),
						value: String(price),
						price: String(price),
						item_name: `구글폼 변환 (${respondentCount}명)`,
						entry_type: "form_convert",
					});

					try {
						await createRequest(
							buildCreateRequestBody({
								formLink,
								requesterEmail: email,
								respondentCount,
								gender: (gender ?? "ALL") as GenderCode,
								ages:
									ages && ages.length > 0
										? (ages as AgeCode[])
										: (["ALL"] as AgeCode[]),
								residence: (residence ?? "ALL") as RegionCode,
								deadlineIsoDate: deadline,
								paidTotalCoin: price,
								discountCode,
								interests,
								screening,
							}),
						);
						console.log("구글폼 변환 신청이 완료되었습니다.");
					} catch (error) {
						console.error("구글폼 변환 신청 실패:", error);
					}

					// 결제 완료 후 성공 페이지로 이동
					navigate("/payment/google-form-conversion-success", {
						state: {
							respondentCount,
							price,
							orderId,
						},
					});
				}
			},
			onError: (error) => {
				console.error("인앱결제에 실패했어요:", error);
			},
		});
	};

	return (
		<>
			<div className="pb-28">
				<Top
					title={
						<Top.TitleParagraph size={22} color={adaptive.grey900}>
							구글폼 변환 {formatPrice(price)}원 결제할까요?
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
			</div>
			<BottomInfo>
				<Post.Paragraph paddingBottom={8} typography="t7">
					<Paragraph.Text>
						<b>안내사항</b>
					</Paragraph.Text>
				</Post.Paragraph>
				<Post.Paragraph paddingBottom={8} typography="t7">
					<Paragraph.Text>
						토스는 해당 서비스 제휴사이며, 결제는 애플 앱스토어를 통해서
						진행돼요
					</Paragraph.Text>
				</Post.Paragraph>
				<Post.Paragraph paddingBottom={8} typography="t7">
					<Paragraph.Text>
						환불 신청은 애플 앱스토어에서만 가능해요, 토스를 통한 환불 신청은
						불가해요
					</Paragraph.Text>
				</Post.Paragraph>
				<Post.Paragraph paddingBottom={24} typography="t7">
					<Paragraph.Text></Paragraph.Text>
				</Post.Paragraph>
			</BottomInfo>
			<FixedBottomCTA
				loading={false}
				disabled={!selectedProduct || price <= 0}
				onClick={handlePayment}
				bottomAccessory={
					!selectedProduct
						? "결제 가능한 상품 정보가 없어요, 옵션 페이지에서 다시 시도해주세요"
						: price <= 0
							? "결제 금액 정보가 없어요, 옵션 페이지에서 다시 시도해주세요"
							: undefined
				}
			>
				결제하기
			</FixedBottomCTA>
		</>
	);
};
