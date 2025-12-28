import { IAP, type IapProductListItem } from "@apps-in-toss/web-framework";
import { adaptive } from "@toss/tds-colors";
import {
	Border,
	Checkbox,
	FixedBottomCTA,
	List,
	ListRow,
	Paragraph,
	Text,
	Top,
} from "@toss/tds-mobile";
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useMultiStep } from "../../contexts/MultiStepContext";
import { usePaymentEstimate } from "../../contexts/PaymentContext";
import { queryClient } from "../../contexts/queryClient";
import { useBackEventListener } from "../../hooks/useBackEventListener";
import { createPayment } from "../../service/payments";
import { type createUserResponse, getUserInfo } from "../../service/user";
import { calculateRequiredCoinAmount } from "../../utils/paymentCalculator";

export const PaymentProductPage = () => {
	const { goNextPayment, goPrevPayment, setPaymentStep } = useMultiStep();
	const { selectedCoinAmount, handleSelectedCoinAmountChange, totalPrice } =
		usePaymentEstimate();
	const location = useLocation();
	const navigate = useNavigate();
	const isChargeFlow = location.pathname === "/payment/charge";

	const [products, setProducts] = useState<IapProductListItem[]>([]);
	const [userInfo, setUserInfo] = useState<createUserResponse | null>(null);

	const displayAmount = useMemo(() => {
		if (!userInfo) {
			return totalPrice;
		}
		return calculateRequiredCoinAmount(userInfo.result.coin, totalPrice);
	}, [userInfo, totalPrice]);

	const handleNext = () => {
		if (!selectedCoinAmount?.sku) {
			console.error("상품 정보가 없습니다");
			return;
		}

		// 코인 충전 플로우 즉시 결제
		if (isChargeFlow) {
			IAP.createOneTimePurchaseOrder({
				options: {
					sku: selectedCoinAmount.sku,
					processProductGrant: async ({ orderId }) => {
						try {
							await createPayment({
								orderId,
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
				onEvent: (event) => {
					if (event.type === "success") {
						console.log(
							"코인 충전 결제에 성공했어요. 주문 번호:",
							event.data.orderId,
						);
						queryClient.invalidateQueries({ queryKey: ["memberInfo"] });
						setPaymentStep(2);
					}
				},
				onError: (error) => {
					console.error("코인 충전 결제에 실패했어요:", error);
				},
			});
			return;
		}

		// 설문 생성 플로우 기존 단계 진행
		goNextPayment();
	};

	useEffect(() => {
		async function fetchProducts() {
			try {
				const response = await IAP.getProductItemList();
				setProducts(response?.products ?? []);
				const userInfoResult = await getUserInfo();
				setUserInfo(userInfoResult);
			} catch (error) {
				console.error("상품 목록을 가져오는 데 실패했어요:", error);
			}
		}

		fetchProducts();
	}, []);

	useBackEventListener(() => {
		if (isChargeFlow) {
			navigate("/mypage");
		} else {
			goPrevPayment();
		}
	});

	return (
		<div className="flex flex-col h-screen">
			{isChargeFlow ? (
				<div className="px-4 pt-8 pb-4">
					<Text
						display="block"
						color={adaptive.grey900}
						typography="st5"
						fontWeight="bold"
						className="mb-2"
					>
						코인을 얼마나 충전할까요?
					</Text>
					<Text
						display="block"
						color={adaptive.grey700}
						typography="t6"
						fontWeight="regular"
					>
						코인은 설문을 등록하는데 현금처럼 사용해요
					</Text>
				</div>
			) : (
				<>
					<Top
						title={
							<Top.TitleParagraph size={28}>
								{displayAmount.toLocaleString()}코인
							</Top.TitleParagraph>
						}
						subtitleTop={
							<Top.SubtitleParagraph size={13}>
								충전 필요금액
							</Top.SubtitleParagraph>
						}
						upperGap={40}
						rightVerticalAlign="end"
					/>
					<div className="px-4 flex flex-col gap-2 bg-gray-100 rounded-2xl p-4 mx-6 mb-4">
						<div className="flex justify-between items-center gap-1">
							<Text
								color={adaptive.grey700}
								typography="t6"
								fontWeight="regular"
							>
								총 필요 코인
							</Text>
							<Text
								color={adaptive.grey700}
								typography="t5"
								fontWeight="semibold"
							>
								{totalPrice.toLocaleString()} 코인
							</Text>
						</div>
						<div className="flex justify-between items-center gap-1">
							<Text
								color={adaptive.grey700}
								typography="t6"
								fontWeight="regular"
							>
								현재 보유한 코인
							</Text>
							<Text
								color={adaptive.grey700}
								typography="t5"
								fontWeight="semibold"
							>
								{userInfo?.result.coin.toLocaleString()} 코인
							</Text>
						</div>
						<div className="flex justify-between items-center gap-1">
							<Text
								color={adaptive.grey700}
								typography="t6"
								fontWeight="regular"
							>
								충전 필요 코인
							</Text>
							<Text
								color={adaptive.blue500}
								typography="t5"
								fontWeight="semibold"
							>
								{calculateRequiredCoinAmount(
									userInfo?.result.coin ?? 0,
									totalPrice,
								).toLocaleString()}
								코인
							</Text>
						</div>
					</div>
					<Border variant="height16" />
				</>
			)}
			<div className="flex-1 overflow-y-auto mt-4">
				<List>
					{products.map((product) => {
						const isSelected = selectedCoinAmount?.sku === product.sku;
						return (
							<ListRow
								key={product.sku}
								role="checkbox"
								aria-checked={isSelected}
								contents={
									<ListRow.Texts
										type="2RowTypeA"
										top={product.displayName}
										topProps={{ color: adaptive.grey700, fontWeight: "bold" }}
										bottom={
											<Paragraph.Text>{product.displayAmount}</Paragraph.Text>
										}
										bottomProps={{ color: adaptive.grey600 }}
									/>
								}
								right={
									<Checkbox.Line
										checked={isSelected}
										size={30}
										aria-hidden={true}
									/>
								}
								verticalPadding="large"
								onClick={() =>
									handleSelectedCoinAmountChange({
										sku: product.sku,
										displayName: product.displayName,
										displayAmount: product.displayAmount,
									})
								}
							/>
						);
					})}
				</List>
			</div>
			<FixedBottomCTA
				disabled={!selectedCoinAmount}
				loading={false}
				onClick={handleNext}
			>
				다음
			</FixedBottomCTA>
		</div>
	);
};
