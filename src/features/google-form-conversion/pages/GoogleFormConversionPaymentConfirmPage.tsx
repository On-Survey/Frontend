import { IAP, type IapProductListItem } from "@apps-in-toss/web-framework";
import {
	QUESTION_COUNT_OPTIONS,
	type QuestionCountRange,
} from "@features/payment/constants/payment";
import { createGoogleFormPayment } from "@features/payment/service/payments";
import {
	getGoogleFormConversionTablePrice,
	type ParticipantTier,
} from "@shared/lib/estimatePricingTable";
import { pushGtmEvent } from "@shared/lib/gtm";
import { adaptive } from "@toss/tds-colors";
import {
	Asset,
	BottomInfo,
	FixedBottomCTA,
	Paragraph,
	Post,
	Text,
	Top,
} from "@toss/tds-mobile";
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getGoogleFormIapRetailPriceWon } from "../lib/googleFormIapRetailPrice";
import { pickGoogleFormIapProduct } from "../lib/pickGoogleFormIapProduct";
import { createGoogleFormConversionRequest } from "../service/api";

const questionRangeLabel = (range: QuestionCountRange): string =>
	QUESTION_COUNT_OPTIONS.find((o) => o.value === range)?.name ?? range;

/** API·내부 처리용 구간 상한 문항 수 */
const QUESTION_RANGE_MAX_QUESTIONS: Record<QuestionCountRange, number> = {
	"1~30": 30,
	"31~50": 50,
};

const formatPrice = (price: number) =>
	price.toLocaleString("ko-KR", { maximumFractionDigits: 0 });

export const GoogleFormConversionPaymentConfirmPage = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const [selectedProduct, setSelectedProduct] =
		useState<IapProductListItem | null>(null);
	const [isLoadingIapProducts, setIsLoadingIapProducts] = useState(true);
	const [iapResolveError, setIapResolveError] = useState<string | null>(null);

	const locationState = location.state as
		| {
				formLink: string;
				email: string;
				questionCountRange: QuestionCountRange;
				respondentCount: ParticipantTier;
				deadline: string;
				price: number;
		  }
		| undefined;

	const formLink = locationState?.formLink ?? "";
	const email = locationState?.email ?? "";
	const questionCountRange = locationState?.questionCountRange ?? "1~30";
	const respondentCount = locationState?.respondentCount ?? 50;
	const deadline = locationState?.deadline ?? "";

	/** 견적표 공급가(앱 안내·form-requests API) */
	const supplyPrice = useMemo(
		() =>
			getGoogleFormConversionTablePrice(respondentCount, questionCountRange),
		[respondentCount, questionCountRange],
	);

	/** 인앱·스토어 표시 금액(판매가, VAT 포함 등) — `displayAmount` 매칭용 */
	const retailPrice = useMemo(
		() => getGoogleFormIapRetailPriceWon(supplyPrice),
		[supplyPrice],
	);

	// 인앱 displayAmount(판매가)와 일치하는 상품만 사용 (공급가로는 스토어와 안 맞음)
	useEffect(() => {
		let cancelled = false;

		async function fetchProducts() {
			setIsLoadingIapProducts(true);
			setIapResolveError(null);
			setSelectedProduct(null);
			try {
				const response = await IAP.getProductItemList();
				const products = response?.products ?? [];
				const picked = pickGoogleFormIapProduct(
					products,
					retailPrice,
					supplyPrice,
				);
				if (cancelled) return;
				setSelectedProduct(picked);
				if (!picked) {
					setIapResolveError(
						`인앱 상품 표시 금액이 ${formatPrice(retailPrice)}원인 상품이 없어요. 스토어에 판매가를 이 금액으로 맞춰 주세요. (견적 공급가 ${formatPrice(supplyPrice)}원)`,
					);
				}
			} catch (error) {
				console.error("상품 목록을 가져오는 데 실패했어요:", error);
				if (!cancelled) {
					setIapResolveError("결제 상품 목록을 불러오지 못했어요.");
				}
			} finally {
				if (!cancelled) {
					setIsLoadingIapProducts(false);
				}
			}
		}

		fetchProducts();
		return () => {
			cancelled = true;
		};
	}, [retailPrice, supplyPrice]);

	const handlePayment = () => {
		pushGtmEvent({
			event: "form_coin_charge",
			pagePath: "/payment/google-form-conversion-payment-confirm",
		});
		if (!selectedProduct?.sku) {
			console.error("상품 정보가 없습니다");
			return;
		}

		IAP.createOneTimePurchaseOrder({
			options: {
				sku: selectedProduct.sku,
				processProductGrant: async ({ orderId }) => {
					try {
						await createGoogleFormPayment({
							orderId,
							price: retailPrice,
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

					pushGtmEvent({
						event: "purchase",
						pagePath: "/payment/google-form-conversion-payment-confirm",
						transaction_id: String(orderId),
						value: String(retailPrice),
						price: String(retailPrice),
						item_name: `${questionRangeLabel(questionCountRange)} (${respondentCount}명)`,
						entry_type: "form_convert",
					});

					// 구글폼 변환 신청 API 호출
					try {
						await createGoogleFormConversionRequest({
							formLink,
							questionCount: QUESTION_RANGE_MAX_QUESTIONS[questionCountRange],
							targetResponseCount: respondentCount,
							deadline,
							requesterEmail: email,
							price: supplyPrice,
						});
						console.log("구글폼 변환 신청이 완료되었습니다.");
					} catch (error) {
						console.error("구글폼 변환 신청 실패:", error);
					}

					// 결제 완료 후 성공 페이지로 이동
					navigate("/payment/google-form-conversion-success", {
						state: {
							questionCountRange,
							respondentCount,
							price: retailPrice,
							supplyPrice,
							retailPrice,
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
							{formatPrice(retailPrice)}원으로{" "}
							{questionRangeLabel(questionCountRange)}를 구매할까요?
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
			{iapResolveError ? (
				<div className="px-4 pb-3">
					<Text color={adaptive.red500} typography="t7">
						{iapResolveError}
					</Text>
				</div>
			) : null}
			<FixedBottomCTA
				loading={isLoadingIapProducts}
				disabled={!selectedProduct?.sku || !!iapResolveError}
				onClick={handlePayment}
			>
				결제하기
			</FixedBottomCTA>
		</>
	);
};
