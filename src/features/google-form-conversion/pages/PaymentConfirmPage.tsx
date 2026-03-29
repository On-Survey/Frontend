import { IAP, type IapProductListItem } from "@apps-in-toss/web-framework";
import type { Interest } from "@features/create-survey/service/form/types";
import type { ScreeningDraft } from "@features/google-form-conversion/types";
import type {
	AgeCode,
	GenderCode,
	RegionCode,
} from "@features/payment/constants/payment";
import { createGoogleFormPayment } from "@features/payment/service/payments";
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
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { createRequest } from "../service/api";
import {
	buildCreateRequestBody,
	formatDateToISO,
	getDefaultDeadline,
} from "../utils";

type RespondentCount = 50 | 100 | 150 | 200 | 250 | 300;

const formatPrice = (price: number) =>
	price.toLocaleString("ko-KR", { maximumFractionDigits: 0 });

export const PaymentConfirmPage = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const [selectedProduct, setSelectedProduct] =
		useState<IapProductListItem | null>(null);

	const locationState = location.state as
		| {
				formLink: string;
				email: string;
				formQuestionCount?: number | null;
				respondentCount: RespondentCount;
				gender?: string;
				ages?: string[];
				deadline?: string;
				residence?: string;
				interests?: Interest[];
				price: number;
				discountCode?: string;
				screening?: ScreeningDraft;
		  }
		| undefined;

	const formLink = locationState?.formLink ?? "";
	const email = locationState?.email ?? "";
	const respondentCount = locationState?.respondentCount ?? 50;
	const gender = locationState?.gender;
	const ages = locationState?.ages;
	const deadline =
		locationState?.deadline ?? formatDateToISO(getDefaultDeadline());
	const residence = locationState?.residence;
	const interests = locationState?.interests ?? [];
	const screening = locationState?.screening;
	const price = Number(String(locationState?.price ?? 0).replace(/[^\d]/g, ""));
	const discountCode = locationState?.discountCode;

	// 상품 목록 가져오기 및 가격에 맞는 상품 찾기
	useEffect(() => {
		async function fetchProducts() {
			try {
				const response = await IAP.getProductItemList();
				const products = response?.products ?? [];

				const matchingProduct = products.find((product) => {
					const productPrice = parseInt(
						product.displayAmount.replace(/[^\d]/g, ""),
						10,
					);
					return productPrice === price;
				});

				if (matchingProduct) {
					setSelectedProduct(matchingProduct);
				} else {
					const sortedProducts = [...products].sort((a, b) => {
						const priceA = parseInt(a.displayAmount.replace(/[^\d]/g, ""), 10);
						const priceB = parseInt(b.displayAmount.replace(/[^\d]/g, ""), 10);
						const diffA = Math.abs(priceA - price);
						const diffB = Math.abs(priceB - price);
						return diffA - diffB;
					});
					if (sortedProducts.length > 0) {
						setSelectedProduct(sortedProducts[0]);
					}
				}
			} catch (error) {
				console.error("상품 목록을 가져오는 데 실패했어요:", error);
			}
		}

		fetchProducts();
	}, [price]);

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
			<FixedBottomCTA loading={false} onClick={handlePayment}>
				결제하기
			</FixedBottomCTA>
		</>
	);
};
